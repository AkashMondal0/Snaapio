import { timeFormat } from '@/lib/timeFormat';
import { RootState } from '@/redux-stores/store';
import { Message } from '@/types';
import { memo } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, TouchableOpacity, Image } from '@/components/skysolo-ui';



const MessageItem = memo(function Item({
    data, myself, seenMessage
}: { data: Message, myself: boolean, seenMessage: boolean }) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const color = myself ? currentTheme?.primary_foreground : currentTheme?.foreground
    const bg = myself ? currentTheme?.primary : currentTheme?.muted

    const TimeFooter = () => {
        return (<View style={{
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
            {myself ? <Icon iconName="CheckCheck" size={20} color={seenMessage ? currentTheme?.chart_1 : color} />
                : <View/>}
        </View>)
    }

    if (data.fileUrl.length > 0) {
        return <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.9}
            style={{
                flexDirection: 'row',
                justifyContent: myself ? 'flex-end' : 'flex-start',
                padding: 6,
            }}>
            <View style={{
                backgroundColor: bg,
                padding: 4,
                borderRadius: 16,
                width: '70%',
                maxWidth: '96%',
            }}>
                {data?.fileUrl.map((file, index) => {
                    return (<Image
                        key={index}
                        isBorder
                        url={file.urls?.high}
                        style={{
                            width: "100%",
                            height: 300,
                            borderRadius: 16,
                            marginBottom: 4,
                        }} />)
                })}
                <Text
                    style={{
                        color: color,
                        fontSize: 16,
                        lineHeight: 24,
                        fontWeight: '400',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                    }}>
                    {data?.content ?? 'Image'}
                </Text>
                <TimeFooter />
            </View>
        </TouchableOpacity>
    }

    // text message
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
            <TimeFooter />
        </View>
    </View>
}, (prev, next) => prev.seenMessage === next.seenMessage)

export default MessageItem;