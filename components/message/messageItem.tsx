import { timeFormat } from '@/lib/timeFormat';
import { Message } from '@/types';
import { memo } from 'react';
import { View, Text } from 'react-native';
import { Icon, Image } from '@/components/skysolo-ui';
import { TouchableOpacity, useTheme } from 'hyper-native-ui';   
import React from 'react';
const MessageItem = memo(function Item({
    data, myself, seenMessage,
    navigateToImagePreview
}: {
    data: Message, myself: boolean, seenMessage: boolean,
    navigateToImagePreview: (data: Message) => void
}) {
    const { currentTheme } = useTheme();
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
                : <View />}
        </View>)
    }

    if (data.fileUrl.length > 0) {
        return <ImageComponent
            navigateToImagePreview={navigateToImagePreview}
            bg={bg}
            data={data} myself={myself}
            footer={<>
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
            </>} />
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

const ImageComponent = ({
    data,
    myself,
    footer,
    bg,
    navigateToImagePreview
}: {
    data: Message,
    myself: boolean,
    footer?: React.ReactNode
    bg?: string
    navigateToImagePreview: (data: Message) => void
}) => {
    // 4+ images
    if (data.fileUrl.length > 3) {
        return <TouchableOpacity
            onPress={() => { navigateToImagePreview(data) }}
            activeOpacity={0.9}
            style={{
                flexDirection: 'row',
                justifyContent: myself ? 'flex-end' : 'flex-start',
                padding: 6,
                marginVertical: 8,
            }}>
            <View style={{
                width: '70%',
                height: 440,
                aspectRatio: 1 / 1,
                borderRadius: 16,
                backgroundColor: bg,
                padding: 5,
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: 5,
            }}>
                {data?.fileUrl.slice(0, 4).map((file, index) => {
                    const isLast = index === 3
                    if (isLast && data.fileUrl.length > 4) {
                        return (<View
                            key={index}
                            style={{
                                borderRadius: 16,
                                width: "49%",
                                height: "49%",
                                aspectRatio: 1 / 1,
                                position: "relative",
                                overflow: "hidden",
                            }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                // onPress={}
                                style={{
                                    position: "absolute",
                                    zIndex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0,0,0,0.6)"
                                }}>
                                <Text style={{
                                    color: "white",
                                    fontSize: 32,
                                    fontWeight: "semibold",
                                }}>
                                    {`+${data.fileUrl.length - 4}`}
                                </Text>
                            </TouchableOpacity>
                            <Image
                                key={index}
                                isBorder
                                url={file.urls?.low}
                                style={{
                                    flex: 1,
                                    borderRadius: 16,
                                }} />
                        </View>)
                    }
                    return <Image
                        key={index}
                        isBorder
                        url={file.urls?.low}
                        style={{
                            width: "49%",
                            height: "49%",
                            aspectRatio: 1 / 1,
                            borderRadius: 16,
                        }} />
                })}
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    marginVertical: 8,
                    marginHorizontal: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 5,
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 14,
                        fontWeight: '400',
                    }}>
                        {timeFormat(data?.createdAt as string)}
                    </Text>
                    {myself ? <Icon iconName="CheckCheck" size={20} color="white" />
                        : <View />}
                </View>
            </View>
        </TouchableOpacity>
    }
    // 1-3 images
    return <TouchableOpacity
        onPress={() => { navigateToImagePreview(data) }}
        activeOpacity={0.9}
        style={{
            flexDirection: 'row',
            justifyContent: myself ? 'flex-end' : 'flex-start',
            padding: 6,
            marginVertical: 8,
        }}>
        <View style={{
            width: '70%',
            maxWidth: '96%',
        }}>
            {data?.fileUrl.map((file, index) => {
                return (<View
                    key={index}
                    style={{
                        backgroundColor: bg,
                        borderRadius: 16,
                        flex: 1,
                        padding: 5,
                        marginBottom: 5,
                    }}>
                    <View>
                        <Image
                            isBorder
                            url={file.urls?.high}
                            style={{
                                width: "100%",
                                height: 300,
                                borderRadius: 16,
                                marginBottom: 4,
                            }} />
                    </View>
                    {footer}
                </View>)
            })}
        </View>
    </TouchableOpacity>
}