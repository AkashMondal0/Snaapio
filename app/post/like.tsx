/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import { Avatar } from "@/components/skysolo-ui";
import { Text, Loader, TouchableOpacity } from "hyper-native-ui";
import { AuthorData } from "@/types";
import { FlatList, View } from "react-native";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import UserItemLoader from "@/components/loader/user-loader";
import { useGQArray } from "@/lib/useGraphqlQuery";
import { QPost } from "@/redux-stores/slice/post/post.queries";
import { StackActions, StaticScreenProps, useNavigation } from "@react-navigation/native";

type Props = StaticScreenProps<{
    id: string;
}>;

const LikeScreen = memo(function LikeScreen({ route }: Props) {
    const _postId = route?.params?.id;
    const navigation = useNavigation()
    const { data, error, loadMoreData, loading, reload, requestCount } = useGQArray<AuthorData>({
        query: QPost.findAllLikes,
        variables: {
            limit: 12,
            id: _postId
        },
    });

    const onPress = useCallback((username: string) => {
        navigation.dispatch(StackActions.replace("Profile", { id: username }))
    }, []);

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Likes" />
            {error ?
                <ErrorScreen /> :
                <FlatList
                    removeClippedSubviews={true}
                    scrollEventThrottle={16}
                    windowSize={10}
                    data={data}
                    renderItem={({ item }) => (<LikeItem data={item} onPress={onPress} />)}
                    keyExtractor={(item, index) => item.id}
                    bounces={false}
                    onEndReachedThreshold={0.5}
                    refreshing={false}
                    onEndReached={loadMoreData}
                    onRefresh={reload}
                    ListEmptyComponent={loading !== "normal" ? <View /> : <ListEmpty text="No likes yet" />}
                    ListFooterComponent={loading !== "normal" ? <>
                        {loading === "pending" && requestCount === 0 ? <UserItemLoader size={10} /> : <Loader size={50} />}
                    </> : <View />} />}
        </View>
    )
});
export default LikeScreen;

const LikeItem = memo(function CommentItem({
    data,
    onPress,
}: {
    data: AuthorData
    onPress: (data: string) => void
}) {

    return (<TouchableOpacity
        onPress={() => {
            onPress(data.username)
        }}
        style={{
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center',
            width: '100%',
            gap: 10,
            marginVertical: 2,
            justifyContent: 'space-between',
        }}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
        }}>
            <Avatar url={data.profilePicture} size={50} onPress={() => {
                onPress(data.username)
            }} />
            <View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                    <Text variant="H6">
                        {data.username}
                    </Text>
                </View>
                <Text variantColor="secondary">
                    {data.name}
                </Text>
            </View>
        </View>
        {/* <Text variant="heading4" colorVariant="secondary">{isProfile ? 'You' : ''}</Text> */}
    </TouchableOpacity>)
}, (pre, next) => pre?.data?.id === next?.data?.id)