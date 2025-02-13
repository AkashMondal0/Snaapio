/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { createContext, memo, useCallback, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { configs } from "@/configs";
import { ToastAndroid } from "react-native";
import { Typing, Notification, Message } from "@/types";
import { setMessage, setMessageSeen, setTyping } from "@/redux-stores/slice/conversation";
import { fetchConversationsApi } from "@/redux-stores/slice/conversation/api.service";
import { setNotification } from "@/redux-stores/slice/notification";
import { fetchUnreadMessageNotificationCountApi } from "@/redux-stores/slice/notification/api.service";
import React from "react";

const SocketConnectionsProvider = memo(function SocketConnectionsProvider() {
    const dispatch = useDispatch()
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const currentConversation = useSelector((state: RootState) => state.ConversationState.conversation)
    const list = useSelector((state: RootState) => state.ConversationState.conversationList)
    const socketRef = useRef<Socket | null>(null)

    const SocketConnection = useCallback(async () => {
        if (!session || socketRef.current) return;
        socketRef.current = io(`${configs.serverApi?.baseUrl?.replace("/v1", "")}/chat`, {
            transports: ['websocket'],
            withCredentials: true,
            extraHeaders: {
                Authorization: session.accessToken
            },
            query: {
                userId: session.id,
                username: session.username
            }
        })
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

    const incomingCall = useCallback(()=>{},[])

    useEffect(() => {
        SocketConnection()
        if (socketRef.current && session?.id) {
            socketRef.current?.on(configs.eventNames.conversation.message, checkFunction);
            socketRef.current?.on(configs.eventNames.conversation.seen, userSeenMessages);
            socketRef.current?.on(configs.eventNames.conversation.typing, typingRealtime);
            socketRef.current?.on(configs.eventNames.notification.post, notification);
            socketRef.current?.on(configs.eventNames.calling.incomingCall, incomingCall);
            socketRef.current?.on("test", systemMessageFromServerSocket);
            socketRef.current?.on("connect", () => {
                ToastAndroid.show("Connected to socket server", ToastAndroid.SHORT)
            });
            socketRef.current?.on("disconnect", () => {
                socketRef.current = null
                ToastAndroid.show("Disconnected from socket server", ToastAndroid.SHORT)
            });
            return () => {
                socketRef.current?.off('connect')
                socketRef.current?.off('disconnect')
                socketRef.current?.off('test')
                socketRef.current?.off(configs.eventNames.conversation.message)
                socketRef.current?.off(configs.eventNames.conversation.seen)
                socketRef.current?.off(configs.eventNames.conversation.typing)
                socketRef.current?.off(configs.eventNames.notification.post)
            }
        }
    }, [session, currentConversation, list.length])

    return <></>
})


export default memo(SocketConnectionsProvider);