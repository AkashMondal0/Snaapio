import { FlashList } from '@shopify/flash-list';
import { memo, useState } from 'react';
import { Message } from '@/types';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { timeFormat } from '@/lib/timeFormat';
import { Icon, Loader } from '@/components/skysolo-ui';

const MessageList = memo(function MessageList({
    conversation,
    messages
}: {
    conversation: any,
    messages: Message[]
}) {
    const [loading, setLoading] = useState(true)

    return (<FlashList
        onLoad={() => setLoading(false)}
        renderItem={({ item }) => <Item data={item} key={item.id}
            myself={"2d1a43de-d6e9-4136-beb4-974a9fcc3c8b" === item.authorId} />}
        keyExtractor={(item, index) => index.toString()}
        scrollEventThrottle={400}
        estimatedItemSize={6}
        ListEmptyComponent={loading ? <Loader /> : <Text>No messages</Text>}
        data={messages} />)
})

export default MessageList


const Item = memo(function Item({ data, myself }: { data: Message, myself: boolean }) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const color =  currentTheme?.foreground
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
                {myself ? <Icon iconName="CheckCheck" size={20} color={color} /> : <View style={{ width: 20 }} />}
            </View>
        </View>

    </View>
})