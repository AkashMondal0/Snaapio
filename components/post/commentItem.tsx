import React from "react";
import { memo, useCallback, useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Text, TouchableOpacity } from "hyper-native-ui";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { timeAgoFormat } from "@/lib/timeFormat";
import { Comment } from "@/types";

const CommentItem = memo(function CommentItem({
    data,
}: {
    data: Comment
}) {
    const navigation = useNavigation()
    const [readMore, setReadMore] = useState(false)

    if (!data.user) return <></>
    return (<TouchableOpacity
        onPress={() => setReadMore(!readMore)}
        style={{
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center',
            width: '100%',
            gap: 6,
            marginVertical: 2,
            justifyContent: 'space-between',
        }}>
        <View style={{
            gap: 10,
            alignItems: 'center',
            flexDirection: 'row',
            flexBasis: '76%',
        }}>
            <Avatar url={data.user.profilePicture} size={50}
                onPress={() => {
                    navigation.dispatch(StackActions.replace("Profile", { id: data.user.username }))
                }} />
            <View>
                <Text numberOfLines={readMore ? 100 : 3} ellipsizeMode="tail">
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.dispatch(StackActions.replace("Profile", { id: data.user.username }))
                        }}>
                        <Text lineBreakMode="clip" numberOfLines={2}>
                            {data.user.name}{" "}
                        </Text>
                    </TouchableWithoutFeedback>
                    <Text
                        variantColor="secondary"
                        numberOfLines={2}>
                        {data.content}
                    </Text>
                </Text>
                {/* action */}
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <Text variantColor="secondary" variant="body2">
                        {timeAgoFormat(data.createdAt)}
                    </Text>
                    <Text variantColor="default">
                        reply
                    </Text>
                    <Text variantColor="Red">
                        report
                    </Text>
                </View>
            </View>
        </View>
        <Icon iconName="Heart" size={24}
            onPress={() => {
                navigation.navigate("Profile", { id: data.user.username })
            }}
            style={{
                width: "10%"
            }} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
});

export default CommentItem;
