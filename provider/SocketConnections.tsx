/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { configs } from "@/configs";
import { Linking, ToastAndroid } from "react-native";
import { Typing, Notification, Message } from "@/types";
import { setMessage, setMessageSeen, setTyping } from "@/redux-stores/slice/conversation";
import { fetchConversationsApi } from "@/redux-stores/slice/conversation/api.service";
import { setNotification } from "@/redux-stores/slice/notification";
import { fetchUnreadMessageNotificationCountApi } from "@/redux-stores/slice/notification/api.service";
import React from "react";
import { setCallStatus } from "@/redux-stores/slice/call";
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from "@/lib/registerForPushNotificationsAsync";


// create socket context 
export const SocketContext = React.createContext<{
    socket: Socket | null,
    callSound: (data: "END" | "START") => void
}>({
    socket: null,
    callSound: (data: "END" | "START") => { }
});
let loaded = false;
const SocketConnectionsProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.AuthState.session.user);
    const list = useSelector((state: RootState) => state.ConversationState.conversationList)
    const socketRef = useRef<Socket | null>(null)
    const [socketConnected, setSocketConnected] = useState(false)

    const SocketConnection = useCallback(async () => {
        if (!session || !session?.accessToken || socketRef.current) return;
        socketRef.current = io(`${configs.serverApi?.baseUrl?.replace("/v1", "")}/chat`, {
            transports: ['websocket'],
            withCredentials: true,
            extraHeaders: {
                Authorization: session?.accessToken
            },
            query: {
                userId: session.id,
                username: session.username
            }
        })
        setSocketConnected(true)
    }, [session])

    const checkFunction = useCallback((data: Message) => {
        if (data.authorId === session?.id) return;
        if (list.find(con => con.id === data.conversationId)) {
            dispatch(setMessage(data))
        } else {
            if (list.length > 0) {
                dispatch(fetchConversationsApi({
                    limit: 12,
                    offset: 0,
                }) as any)
            }
        }
        dispatch(fetchUnreadMessageNotificationCountApi() as any)
    }, [session, list])

    const userSeenMessages = useCallback((data: { conversationId: string, authorId: string }) => {
        if (data.authorId === session?.id) return;
        dispatch(setMessageSeen(data))
    }, [session])

    const typingRealtime = useCallback((data: Typing) => {
        if (data.authorId === session?.id) return;
        dispatch(setTyping(data))
    }, [session])

    const notification = useCallback((data: Notification) => {
        if (data.authorId === session?.id) return;
        dispatch(setNotification(data))
    }, [session])

    const systemMessageFromServerSocket = useCallback(() => {
        ToastAndroid.show("Test from socket server", ToastAndroid.SHORT)
    }, [])

    const callSound = useCallback(async (data: "END" | "START") => {
        if (data === "END") {
            const { sound: End } = await Audio.Sound.createAsync(
                require('../assets/audios/callleave.wav')
            )
            await End.playAsync();
            return;
        }
        const { sound: Start } = await Audio.Sound.createAsync(
            require('../assets/audios/connect.wav')
        )
        await Start.playAsync();
    }, [])

    const incomingCall = useCallback(async (data: {
        username: string;
        email: string
        id: string;
        name: string;
        profilePicture: string
        status: "CALLING" | "HANGUP"
        stream: "video" | "audio"
    }) => {
        if (data.status === "CALLING") {
            dispatch(setCallStatus("IDLE"))
            const url = `snaapio://incoming_call?username=${data.username}&email=${data.email}&id=${data.id}&name=${data.name}&profilePicture=${data.profilePicture}&userType=REMOTE&stream=${data.stream}`;
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                ToastAndroid.show("Internal Error incomingCall", ToastAndroid.SHORT);
            }
        }
        if (data.status === "HANGUP") {
            dispatch(setCallStatus("DISCONNECTED"))
        }
    }, [])


    //   const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    //   undefined
    // );

    useEffect(() => {
        registerForPushNotificationsAsync();
        SocketConnection();
        if (socketRef.current && session?.id) {
            // socketRef.current?.on("test", systemMessageFromServerSocket);
            // socketRef.current?.on("connect", () => {
            //     ToastAndroid.show("Connected to socket server", ToastAndroid.SHORT)
            // });
            // socketRef.current?.on("disconnect", () => {
            //     socketRef.current = null
            //     ToastAndroid.show("Disconnected from socket server", ToastAndroid.SHORT)
            // });
            socketRef.current?.on(configs.eventNames.conversation.message, checkFunction);
            socketRef.current?.on(configs.eventNames.conversation.seen, userSeenMessages);
            socketRef.current?.on(configs.eventNames.conversation.typing, typingRealtime);
            socketRef.current?.on(configs.eventNames.notification.post, notification);
            socketRef.current?.on("send-call", incomingCall);
            const notificationListener = Notifications.addNotificationReceivedListener(notification => {
                console.log(notification);
            });
            Notifications.getLastNotificationResponseAsync()
                .then(response => {
                    const url = response?.notification.request.content.data.url;
                    Linking.openURL(url);
                });
            const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
            });
            return () => {
                // socketRef.current?.off('connect')
                // socketRef.current?.off('disconnect')
                // socketRef.current?.off('test', systemMessageFromServerSocket)
                socketRef.current?.off(configs.eventNames.conversation.message, checkFunction)
                socketRef.current?.off(configs.eventNames.conversation.seen, userSeenMessages)
                socketRef.current?.off(configs.eventNames.conversation.typing, typingRealtime)
                socketRef.current?.off(configs.eventNames.notification.post, notification)
                socketRef.current?.off("send-call", incomingCall)
                // 
                notificationListener.remove();
                responseListener.remove();
            }
        }
    }, [session])


    useEffect(() => {
        if (!loaded) {
            dispatch(fetchConversationsApi({
                limit: 18,
                offset: 0
            }) as any);
            loaded = true;
        }
    }, [])

    return <SocketContext.Provider value={{
        socket: socketRef.current,
        callSound
    }}>
        {children}
    </SocketContext.Provider>
}


export default memo(SocketConnectionsProvider);