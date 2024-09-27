import React from 'react';
import { View } from 'react-native';
import { Conversation } from '@/types';
import {  Avatar, Text } from '@/components/skysolo-ui';

const ConversationDetailsSheet = ({
    data
}: {
    data: Conversation | null
}) => {
    if (!data) return <></>
    return <View style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        padding: 10,
    }}>
        <Avatar
            size={120}
            TouchableOpacityOptions={{
                activeOpacity: 0.3
            }}
            url={data.user?.profilePicture} />
        <Text
            style={{ fontWeight: "600" }}
            variant="heading2">
            {data?.user?.name}
        </Text>
        <Text
            colorVariant='secondary'
            style={{ fontWeight: "400" }}
            variant="heading4">
            {data?.user?.email}
        </Text>
    </View>
}


export default ConversationDetailsSheet;