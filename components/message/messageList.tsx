import { FlashList } from '@shopify/flash-list';
import { memo } from 'react';
import { Message } from '@/types';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { timeFormat } from '@/lib/timeFormat';
import { Icon } from '../skysolo-ui';

const MessageList = memo(function MessageList({
    conversation,
    messages
}: {
    conversation: any,
    messages: Message[]
}) {

    return <FlashList
        renderItem={({ item }) => <Item data={item} key={item.id} />}
        keyExtractor={(item, index) => index.toString()}
        scrollEventThrottle={400}
        estimatedItemSize={10}
        data={messages} />
})

export default MessageList


const Item = memo(function ({ data }: { data: Message }) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 6,
    }}>
        <View style={{
            backgroundColor: currentTheme?.muted,
            padding: 6,
            borderRadius: 16,
            width: 'auto',
            maxWidth: '96%',
        }}>
            <Text
                style={{
                    color: currentTheme?.foreground,
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
                        color: currentTheme?.foreground,
                        fontSize: 16,
                        lineHeight: 24,
                        fontWeight: '400',
                    }}>
                    {timeFormat(data?.createdAt as string)}
                </Text>
                <Icon iconName="CheckCheck" size={20} />
            </View>
        </View>

    </View>
})