/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Linking, ToastAndroid } from "react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import io, { Socket } from "socket.io-client";

import { RootState } from "@/redux-stores/store";
import { configs } from "@/configs";
import { registerForPushNotificationsAsync } from "@/lib/registerForPushNotificationsAsync";

import {
  setMessage,
  setMessageSeen,
  setTyping,
} from "@/redux-stores/slice/conversation";
import {
  fetchConversationsApi,
} from "@/redux-stores/slice/conversation/api.service";

import {
  setNotification,
} from "@/redux-stores/slice/notification";
import {
  fetchUnreadMessageNotificationCountApi,
} from "@/redux-stores/slice/notification/api.service";

import { setCallStatus } from "@/redux-stores/slice/call";

import { Message, Notification as Notify, Typing } from "@/types";

// Context
export const SocketContext = React.createContext<{
  socket: Socket | null;
  callSound: (type: "START" | "END") => void;
}>({
  socket: null,
  callSound: () => {},
});

const SocketConnectionsProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const session = useSelector((state: RootState) => state.AuthState.session.user);
  const conversations = useSelector((state: RootState) => state.ConversationState.conversationList);
  const socketRef = useRef<Socket | null>(null);
  const initialized = useRef(false);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const [socketConnected, setSocketConnected] = useState(false);

  const setupSocket = useCallback(() => {
    if (!session?.accessToken || socketRef.current) return;

    const socket = io(`${configs.serverApi?.baseUrl?.replace("/v1", "")}/chat`, {
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      extraHeaders: {
        Authorization: session.accessToken,
      },
      query: {
        userId: session.id,
        username: session.username,
      },
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      reconnectAttempts.current = 0;
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      socketRef.current = null;
      reconnectAttempts.current += 1;

      if (reconnectAttempts.current <= MAX_RECONNECT_ATTEMPTS) {
        setTimeout(setupSocket, 2000);
      } else {
        ToastAndroid.show("Socket connection failed", ToastAndroid.SHORT);
      }
    });

    socketRef.current = socket;
  }, [session]);

  const callSound = useCallback(async (type: "START" | "END") => {
    const soundFile =
      type === "START"
        ? require("../assets/audios/connect.wav")
        : require("../assets/audios/callleave.wav");

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  }, []);

  const handleIncomingMessage = useCallback((data: Message) => {
    if (data.authorId === session?.id) return;

    const isInConversation = conversations.some(
      (convo) => convo.id === data.conversationId
    );

    if (isInConversation) {
      dispatch(setMessage(data));
    } else {
      dispatch(fetchConversationsApi({ limit: 12, offset: 0 }) as any);
    }

    dispatch(fetchUnreadMessageNotificationCountApi() as any);
  }, [conversations, session]);

  const handleSeenMessage = useCallback((data: { conversationId: string; authorId: string }) => {
    if (data.authorId === session?.id) return;
    dispatch(setMessageSeen(data));
  }, [session]);

  const handleTyping = useCallback((data: Typing) => {
    if (data.authorId === session?.id) return;
    dispatch(setTyping(data));
  }, [session]);

  const handleNotification = useCallback((data: Notify) => {
    if (data.authorId === session?.id) return;
    dispatch(setNotification(data));
  }, [session]);

  const handleCall = useCallback(async (data: {
    username: string;
    email: string;
    id: string;
    name: string;
    profilePicture: string;
    status: "CALLING" | "HANGUP";
    stream: "video" | "audio";
  }) => {
    if (data.status === "CALLING") {
      dispatch(setCallStatus("IDLE"));

      const url = `snaapio://incoming_call?username=${data.username}&email=${data.email}&id=${data.id}&name=${data.name}&profilePicture=${data.profilePicture}&userType=REMOTE&stream=${data.stream}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        ToastAndroid.show("Error opening incoming call", ToastAndroid.SHORT);
      }
    } else if (data.status === "HANGUP") {
      dispatch(setCallStatus("DISCONNECTED"));
    }
  }, []);

  useEffect(() => {
    if (!session?.id) return;

    registerForPushNotificationsAsync();
    setupSocket();

    if (!initialized.current) {
      dispatch(fetchConversationsApi({ limit: 18, offset: 0 }) as any);
      initialized.current = true;
    }
  }, [session]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on(configs.eventNames.conversation.message, handleIncomingMessage);
    socket.on(configs.eventNames.conversation.seen, handleSeenMessage);
    socket.on(configs.eventNames.conversation.typing, handleTyping);
    socket.on(configs.eventNames.notification.post, handleNotification);
    socket.on("send-call", handleCall);

    Notifications.getLastNotificationResponseAsync().then((response) => {
      const url = response?.notification.request.content.data.url;
      if (url) Linking.openURL(url);
    });

    return () => {
      socket.off(configs.eventNames.conversation.message, handleIncomingMessage);
      socket.off(configs.eventNames.conversation.seen, handleSeenMessage);
      socket.off(configs.eventNames.conversation.typing, handleTyping);
      socket.off(configs.eventNames.notification.post, handleNotification);
      socket.off("send-call", handleCall);
    };
  }, [socketConnected]);

  const contextValue = useMemo(() => ({
    socket: socketRef.current,
    callSound,
  }), [socketConnected]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default memo(SocketConnectionsProvider);
