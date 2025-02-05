/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useRef } from "react";
import AppHeader from "@/components/AppHeader";
import { Avatar } from "@/components/skysolo-ui";
import { Text, Loader, TouchableOpacity } from "hyper-native-ui";
import { resetLike } from "@/redux-stores/slice/post";
import { fetchPostLikesApi } from "@/redux-stores/slice/post/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, Comment, disPatchResponse } from "@/types";
import { FlatList, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import { StackActions, StaticScreenProps, useNavigation } from "@react-navigation/native";
import UserItemLoader from "@/components/loader/user-loader";
type Props = StaticScreenProps<{
    id: string;
}>;

let totalFetchedItemCount = 0
let postId = "NO_ID"

const LikeScreen = memo(function LikeScreen({ route }: Props) {
    const _postId = route?.params?.id
    const likes = useSelector((Root: RootState) => Root.PostState.likesUserList)
    const likeLoading = useSelector((Root: RootState) => Root.PostState.likesLoading)
    const likesError = useSelector((Root: RootState) => Root.PostState.likesError)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchPostLikesApi({
                id: _postId,
                offset: totalFetchedItemCount,
                limit: 12
            }) as any) as disPatchResponse<Comment[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [_postId])

    useEffect(() => {
        if (postId !== _postId) {
            postId = _postId
            totalFetchedItemCount = 0
            dispatch(resetLike())
            fetchApi()
        }
    }, [_postId])

    const onEndReached = useCallback(() => {
        if (stopRef.current || totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetLike())
        fetchApi()
    }, [])

    const onPress = useCallback((username: string) => {
        // navigation.navigate("Profile", { id: username })
        navigation.dispatch(StackActions.replace("Profile", { id:  username}))
    }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Likes" />
            <FlatList
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                data={likes}
                renderItem={({ item }) => (<LikeItem data={item} onPress={onPress} />)}
                keyExtractor={(item, index) => index.toString()}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                refreshing={false}
                ListEmptyComponent={() => {
                    if (likeLoading === "idle" || likeLoading === "pending") return <UserItemLoader size={10}/>
                    if (likesError) return <ErrorScreen message={likesError} />
                    if (!likesError && likeLoading === "normal") return <ListEmpty text="No likes yet" />
                }}
                ListFooterComponent={likeLoading === "pending" ? <Loader size={50} /> : <></>}
                onRefresh={onRefresh} />
        </View>
    )
})
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