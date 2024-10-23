import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Conversation, Message, NavigationProps, disPatchResponse } from '@/types';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { Loader } from '@/components/skysolo-ui';
import debounce from "@/lib/debouncing";
import { ToastAndroid } from "react-native";
import { fetchConversationAllMessagesApi } from "@/redux-stores/slice/conversation/api.service";
import MessageItem from './messageItem';
import { SocketContext } from '@/provider/SocketConnections';

const MessageList = memo(function MessageList({
    conversation,
    navigation
}: {
    conversation: Conversation,
    navigation: NavigationProps
}) {
    const stopFetch = useRef(false)
    const dispatch = useDispatch()
    const totalFetchedItemCount = useRef<number>(0)
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const messagesLoading = useSelector((Root: RootState) => Root.ConversationState?.messageLoading)
    const messages = useSelector((Root: RootState) => Root.ConversationState?.messages)
    const socketState = useContext(SocketContext)
    const firstSeen = useRef(false)
    const cMembers = useMemo(() => conversation.members?.map((m) => m).length, [conversation.members])

    useEffect(() => {
        if (!firstSeen.current) {
            socketState.seenAllMessage(conversation.id)
            firstSeen.current = true
        }
    }, [])

    const loadMoreMessages = useCallback(async (conversationId?: string) => {
        if (totalFetchedItemCount.current === -1 || stopFetch.current) return
        if (!conversationId) return ToastAndroid.show('Chat Not Found', ToastAndroid.SHORT)
        try {
            const resM = await dispatch(fetchConversationAllMessagesApi({
                id: conversation.id,
                offset: totalFetchedItemCount.current,
                limit: 20
            }) as any) as disPatchResponse<Message[]>
            if (resM?.error) return ToastAndroid.show('Error loading messages', ToastAndroid.SHORT)
            if (resM.payload?.length > 20) {
                return totalFetchedItemCount.current += resM.payload.length
            }
            totalFetchedItemCount.current = -1
        } finally {
            stopFetch.current = false
        }
    }, [conversation.id])

    const fetchMore = debounce(() => loadMoreMessages(conversation.id), 1000)

    const navigateToImagePreview = useCallback((data: Message) => {
        navigation.navigate('message/assets/preview', { data })
    }, [])

    return (
        <FlatList
            inverted
            removeClippedSubviews={true}
            windowSize={16}
            onEndReached={fetchMore}
            data={messages}
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <MessageItem
                navigateToImagePreview={navigateToImagePreview}
                data={item} seenMessage={cMembers === item.seenBy?.length}
                key={item.id} myself={session?.id === item.authorId} />}
            ListFooterComponent={<View style={{ width: "100%", height: 50 }}>
                {messagesLoading ? <Loader size={36} /> : <></>}
            </View>}
        />)
}, (prev, next) => prev.conversation.id === next.conversation.id)

export default MessageList


