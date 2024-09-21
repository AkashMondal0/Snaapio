import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useRef } from 'react';
import { Conversation, Message, disPatchResponse } from '@/types';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { timeFormat } from '@/lib/timeFormat';
import { Icon, Loader } from '@/components/skysolo-ui';
import debounce from "@/lib/debouncing";
import { ToastAndroid } from "react-native";
import { fetchConversationAllMessagesApi } from "@/redux-stores/slice/conversation/api.service";

const MessageList = memo(function MessageList({
    conversation,
}: {
    conversation: Conversation,
}) {
    const stopFetch = useRef(false)
    const dispatch = useDispatch()
    const totalFetchedItemCount = useRef<number>(0)
    // const scrollViewRef = useRef<any>(null);
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const messagesLoading = useSelector((Root: RootState) => Root.ConversationState?.messageLoading)
    const messages = useSelector((Root: RootState) => Root.ConversationState?.messages)

    const loadMoreMessages = useCallback(async (conversationId?: string) => {
        // console.log('loadMoreMessages', totalFetchedItemCount)
        if (totalFetchedItemCount.current === -1 || stopFetch.current) return
        if (!conversationId) return ToastAndroid.show('Chat Not Found', ToastAndroid.SHORT)
        try {
            const resM = await dispatch(fetchConversationAllMessagesApi({
                id: conversation.id,
                offset: totalFetchedItemCount.current,
                limit: 20
            }) as any) as disPatchResponse<Message[]>
            if (resM?.error) return ToastAndroid.show('Error loading messages', ToastAndroid.SHORT)
            if (resM.payload.length > 0) {
                return totalFetchedItemCount.current += resM.payload.length
            }
            totalFetchedItemCount.current = -1
        } finally {
            stopFetch.current = false
        }
    }, [conversation.id])

    const fetchMore = debounce(() => { loadMoreMessages(conversation.id) }, 1000)

    return (<FlashList
        inverted
        onEndReached={fetchMore}
        // ref={scrollViewRef}
        data={messages}
        estimatedItemSize={100}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item data={item} seenMessage={conversation.members.length === item.seenBy.length}
            key={item.id} myself={session?.id === item.authorId} />}
        ListFooterComponent={<View style={{ width: "100%", height: 50 }}>
            {messagesLoading ? <Loader size={36} /> : <></>}
        </View>} />)
}, (prev, next) => prev.conversation.id === next.conversation.id)

export default MessageList


const Item = memo(function Item({ data, myself, seenMessage }: { data: Message, myself: boolean, seenMessage: boolean }) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const color = myself ? currentTheme?.primary_foreground : currentTheme?.foreground
    const bg = myself ? currentTheme?.primary : currentTheme?.muted

    return <View style={{
        flexDirection: 'row',
        justifyContent: myself ? 'flex-end' : 'flex-start',
        padding: 6,
    }}>
        <View style={{
            backgroundColor: bg,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 16,
            width: 'auto',
            maxWidth: '96%',
        }}>
            <Text
                style={{
                    color: color,
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: '400',
                }}>
                {data?.content}
            </Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 10,
            }}>
                <Text
                    style={{
                        color: color,
                        fontSize: 14,
                        lineHeight: 24,
                        fontWeight: '400',
                    }}>
                    {timeFormat(data?.createdAt as string)}
                </Text>
                {myself && seenMessage ? <Icon iconName="CheckCheck" size={20} color={color} /> : <View style={{ width: 20 }} />}
            </View>
        </View>
    </View>
})