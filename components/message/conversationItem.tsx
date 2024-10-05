import React, { memo } from 'react';
import { View } from 'react-native';
import { Conversation } from '@/types';
import { Avatar, Text, TouchableOpacity } from '@/components/skysolo-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { timeFormat } from '@/lib/timeFormat';

const ConversationItem = memo(function ConversationItem({
    data,
    onClick,
    onLongPress,
}: {
    data: Conversation,
    onClick: (id: Conversation) => void,
    onLongPress: (data: Conversation) => void
}) {
    const currentTyping = useSelector((Root: RootState) => Root.ConversationState.currentTyping)
    const currentTheme = useSelector((Root: RootState) => Root.ThemeState.currentTheme)


    return (<View style={{ paddingHorizontal: 4 }}>
        <TouchableOpacity
            onPress={() => { onClick(data) }}
            style={{
                width: "100%",
                height: 75,
                paddingHorizontal: 10,
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderRadius: 15,
            }}>
            <Avatar size={55} url={data.user?.profilePicture} onLongPress={() => { onLongPress(data) }} />
            <View style={{
                flex: 1,
                justifyContent: "center",
            }}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{ fontWeight: "600", width: "70%" }}
                    variant="heading3">
                    {data?.user?.name}
                </Text>
                <Text
                    colorVariant='secondary'
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{ fontWeight: "400", width: "70%" }}
                    variant="heading4">
                    {currentTyping?.conversationId === data.id && currentTyping.typing ? "typing..." : data?.lastMessageContent ?? "No message yet"}
                </Text>
            </View>
            <View style={{
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                justifyContent: "center",
            }}>
                {data?.totalUnreadMessagesCount > 0 ? <View style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: currentTheme?.primary,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{
                            fontSize: 14,
                            textAlign: "center",
                            color: currentTheme?.primary_foreground,
                            fontWeight: "600"
                        }}
                        variant="heading4">
                        {data?.totalUnreadMessagesCount}
                    </Text>
                </View> : <View style={{
                    width: 30,
                    height: 30,
                }} />}
                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontWeight: "400"
                    }}
                    variant="heading4">
                    {timeFormat(data?.lastMessageCreatedAt as string)}
                </Text>
            </View>
        </TouchableOpacity>
    </View>)
})

export default ConversationItem;