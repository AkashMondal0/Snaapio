/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Conversation, Message, disPatchResponse } from '@/types';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import debounce from "@/lib/debouncing";
import { ToastAndroid } from "react-native";
import { conversationSeenAllMessage, fetchConversationAllMessagesApi } from "@/redux-stores/slice/conversation/api.service";
import MessageItem from './messageItem';
import { Loader } from 'hyper-native-ui';
import { useNavigation } from '@react-navigation/native';
const MessageList = memo(function MessageList({
    conversation,
}: {
    conversation: Conversation,
}) {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const stopFetch = useRef(false)
    const totalFetchedItemCount = useRef<number>(0)
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const messagesLoading = useSelector((Root: RootState) => Root.ConversationState?.messageLoading)
    const messages = useSelector((Root: RootState) => Root.ConversationState?.messages)
    const cMembers = useMemo(() => conversation.members?.map((m) => m).length, [conversation.members])


    const seenAllMessage = useCallback(debounce(() => {
        // const lastMessage = messages[messages.length - 1]?.authorId === session?.id
        if (!conversation?.id || !session?.id) return;
        dispatch(conversationSeenAllMessage({
            conversationId: conversation.id,
            authorId: session?.id,
            members: conversation.members?.filter((member) => member !== session?.id),
        }) as any)
    }, 1000), [session, conversation]);

    useEffect(() => {
        seenAllMessage()
    }, [messages.length])

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
        navigation.navigate("MessageImagePreview" as any, { data })
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
                {messagesLoading === "normal" ? <></> : <Loader size={36} />}
            </View>}
        />)
}, (prev, next) => prev.conversation.id === next.conversation.id)

export default MessageList;
