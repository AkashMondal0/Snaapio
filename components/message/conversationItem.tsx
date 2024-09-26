import React, { memo } from 'react';
import { View } from 'react-native';
import { Conversation } from '@/types';
import { Avatar, Text, TouchableOpacity } from '@/components/skysolo-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';

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

    return (<View style={{ paddingHorizontal: 6 }}>
        <TouchableOpacity
            onPress={() => { onClick(data) }}
            style={{
                width: "100%",
                padding: 10,
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderRadius: 15
            }}>
            <Avatar size={55} url={data.user?.profilePicture} onLongPress={() => { onLongPress(data) }} />
            <View>
                <Text
                    style={{ fontWeight: "600" }}
                    variant="heading3">
                    {data?.user?.name}
                </Text>
                <Text
                    colorVariant='secondary'
                    style={{ fontWeight: "400" }}
                    variant="heading4">
                    {currentTyping?.conversationId === data.id && currentTyping.typing ? "typing..." : data?.lastMessageContent ?? "No message yet"}
                </Text>
            </View>
        </TouchableOpacity>
    </View>)
}, ((prev, next) => prev.data.id === next.data.id))

export default ConversationItem;