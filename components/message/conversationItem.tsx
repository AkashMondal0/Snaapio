import React, { memo } from 'react';
import { View } from 'react-native';
import { Conversation } from '@/types';
import { Avatar } from '@/components/skysolo-ui';
import { Text, TouchableOpacity, useTheme } from "hyper-native-ui";
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
    const { currentTheme } = useTheme();
    const messageCount = data?.totalUnreadMessagesCount > 0

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
                    variant="H6">
                    {data?.user?.name}
                </Text>
                <Text
                    variantColor='secondary'
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    variant="body1"
                    style={{ fontWeight: "400", width: "70%" }}>
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
                <View style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: messageCount ? currentTheme?.primary : "transparent",
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
                        }}>
                        {messageCount ? data?.totalUnreadMessagesCount : ""}
                    </Text>
                </View>
                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{
                        fontSize: 14,
                        textAlign: "center",
                        fontWeight: "400"
                    }}>
                    {timeFormat(data?.lastMessageCreatedAt as string)}
                </Text>
            </View>
        </TouchableOpacity>
    </View>)
})

export default ConversationItem;