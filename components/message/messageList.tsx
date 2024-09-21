import { FlashList } from '@shopify/flash-list';
import { memo } from 'react';
import { Conversation, Message } from '@/types';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { timeFormat } from '@/lib/timeFormat';
import { Icon, Loader } from '@/components/skysolo-ui';

const MessageList = memo(function MessageList({
    conversation,
    fetchMore
}: {
    conversation: Conversation,
    fetchMore: () => void,
}) {
    // const scrollViewRef = useRef<any>(null);
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const messagesLoading = useSelector((Root: RootState) => Root.ConversationState?.messageLoading)
    const messages = useSelector((Root: RootState) => Root.ConversationState?.messages)

    return (<FlashList
        inverted
        onEndReached={fetchMore}
        // ref={scrollViewRef}
        data={messages}
        estimatedItemSize={100}
        bounces={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item data={item} seenMessage={conversation.members.length === item.seenBy.length}
            key={item.id} myself={session?.id === item.authorId} />}
        ListFooterComponent={messagesLoading ? <Loader size={36} /> : <></>}
        ListEmptyComponent={<Text>No messages</Text>} />)
}, (prev, next) => prev.conversation === next.conversation)

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