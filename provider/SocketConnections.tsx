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
import { fetchConversationsApi } from "@/redux-stores/slice/conversation/api.service";
import { setNotification } from "@/redux-stores/slice/notification";
import { fetchUnreadMessageNotificationCountApi } from "@/redux-stores/slice/notification/api.service";
import { setCallStatus } from "@/redux-stores/slice/call";
import { Message, Notification as Notify, Typing } from "@/types";

export const SocketContext = React.createContext<{
  socket: Socket | null;
  callSound: (type: "START" | "END") => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  sendDataToServer: (eventName: string, data: unknown) => void;
  reconnectSocket: () => void;
}>({
  socket: null,
  callSound: () => { },
  connectSocket: () => { },
  disconnectSocket: () => { },
  reconnectSocket: () => { },
  sendDataToServer: () => { },
});

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 2000;

const SocketConnectionsProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const session = useSelector((state: RootState) => state.AuthState.session.user);
  const conversations = useSelector(
    (state: RootState) => state.ConversationState.conversationList
  );

  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const initialized = useRef(false);
  const conversationsRef = useRef(conversations);

  const [socketConnected, setSocketConnected] = useState(false);

  // Executes the provided callback after 4 seconds if possible
  const executeAfterFourSeconds = useCallback((callback: () => void) => {
    const timer = setTimeout(() => {
      callback();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // keep conversationsRef up-to-date
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // ===== Socket Event Handlers =====
  const handleIncomingMessage = useCallback(
    (data: Message) => {
      if (data.authorId === session?.id) return;

      const isInConversation = conversationsRef.current.findIndex(
        (item) => item.id === data.conversationId
      );

      if (isInConversation !== -1) {
        dispatch(setMessage(data));
      } else {
        executeAfterFourSeconds(() => {
          // console.log("Fetching conversations...");
          dispatch(fetchConversationsApi({ limit: 12, offset: 0 }) as any);
        });
      }

      dispatch(fetchUnreadMessageNotificationCountApi() as any);
    },
    [dispatch, session?.id]
  );

  const handleSeenMessage = useCallback(
    (data: { conversationId: string; authorId: string }) => {
      if (data.authorId === session?.id) return;
      dispatch(setMessageSeen(data));
    },
    [dispatch, session?.id]
  );

  const handleTyping = useCallback(
    (data: Typing) => {
      if (data.authorId === session?.id) return;
      dispatch(setTyping(data));
    },
    [dispatch, session?.id]
  );

  const handleNotification = useCallback(
    (data: Notify) => {
      if (data.authorId === session?.id) return;
      dispatch(setNotification(data));
    },
    [dispatch, session?.id]
  );

  const handleCall = useCallback(
    async (data: {
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
        if (supported) Linking.openURL(url);
        else ToastAndroid.show("Error opening incoming call", ToastAndroid.SHORT);
      } else {
        dispatch(setCallStatus("DISCONNECTED"));
      }
    },
    [dispatch]
  );

  // ====== Manage Socket Listeners ======
  const removeSocketListeners = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.off(configs.eventNames.conversation.message, handleIncomingMessage);
    socket.off(configs.eventNames.conversation.seen, handleSeenMessage);
    socket.off(configs.eventNames.conversation.typing, handleTyping);
    socket.off(configs.eventNames.notification.post, handleNotification);
    socket.off("send-call", handleCall);
  }, [
    handleIncomingMessage,
    handleSeenMessage,
    handleTyping,
    handleNotification,
    handleCall,
  ]);

  const addSocketListeners = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on(configs.eventNames.conversation.message, handleIncomingMessage);
    socket.on(configs.eventNames.conversation.seen, handleSeenMessage);
    socket.on(configs.eventNames.conversation.typing, handleTyping);
    socket.on(configs.eventNames.notification.post, handleNotification);
    socket.on("send-call", handleCall);
  }, [
    handleIncomingMessage,
    handleSeenMessage,
    handleTyping,
    handleNotification,
    handleCall,
  ]);

  // ====== Socket Control ======
  const connectSocket = useCallback(() => {
    if (!session?.accessToken || socketRef.current) return;

    const socket = io(
      `${configs.serverApi?.baseUrl?.replace("/v1", "")}/chat`,
      {
        transports: ["websocket"],
        withCredentials: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        extraHeaders: { Authorization: session.accessToken },
        query: { userId: session.id, username: session.username },
      }
    );

    socket.on("connect", () => {
      setSocketConnected(true);
      reconnectAttempts.current = 0;
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      reconnectAttempts.current++;
      socketRef.current = null;

      if (reconnectAttempts.current <= MAX_RECONNECT_ATTEMPTS) {
        setTimeout(connectSocket, RECONNECT_DELAY_MS);
      } else {
        ToastAndroid.show("Socket connection failed", ToastAndroid.SHORT);
      }
    });

    socketRef.current = socket;
    addSocketListeners();
  }, [session, addSocketListeners]);

  const disconnectSocket = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      removeSocketListeners();
      socket.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    }
  }, [removeSocketListeners]);

  const reconnectSocket = useCallback(() => {
    disconnectSocket();
    connectSocket();
  }, [disconnectSocket, connectSocket]);

  const callSound = useCallback(async (type: "START" | "END") => {
    const soundFile =
      type === "START"
        ? require("../assets/audios/connect.wav")
        : require("../assets/audios/callleave.wav");

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  }, []);

  // ===== Lifecycle =====
  useEffect(() => {
    if (!session?.id) return;

    registerForPushNotificationsAsync();
    connectSocket();

    if (!initialized.current) {
      dispatch(fetchConversationsApi({ limit: 18, offset: 0 }) as any);
      initialized.current = true;
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      const url = response?.notification.request.content.data.url;
      if (url) Linking.openURL(url);
    });

    return () => {
      disconnectSocket();
    };
  }, [session, connectSocket, disconnectSocket, dispatch]);

  const sendDataToServer = useCallback((eventName: string, data: unknown) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(eventName, data);
    } else {
      ToastAndroid.show("Socket not connected", ToastAndroid.SHORT);
    }
  }, []);

  // // ===== Context =====
  // const contextValue = useMemo(
  //   () => ({
  //     socket: socketRef.current,
  //     callSound,
  //     connectSocket,
  //     disconnectSocket,
  //     reconnectSocket,
  //     sendDataToServer
  //   }),
  //   [callSound, connectSocket, disconnectSocket, reconnectSocket]
  // );

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      callSound,
      connectSocket,
      disconnectSocket,
      reconnectSocket,
      sendDataToServer
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default memo(SocketConnectionsProvider);
