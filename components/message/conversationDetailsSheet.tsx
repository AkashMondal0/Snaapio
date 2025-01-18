import React from 'react';
import { View } from 'react-native';
import { Conversation } from '@/types';
import { Avatar } from '@/components/skysolo-ui';
import { Text } from "hyper-native-ui";

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
            variant="H5">
            {data?.user?.name}
        </Text>
        <Text
            variantColor='secondary'
            style={{ fontWeight: "400" }}
            variant="H6">
            {data?.user?.email}
        </Text>
    </View>
}


export default ConversationDetailsSheet;