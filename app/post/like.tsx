/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useRef } from "react";
import AppHeader from "@/components/AppHeader";
import { Avatar } from "@/components/skysolo-ui";
import { ThemedView, Text, TouchableOpacity, Loader } from "hyper-native-ui";

import { resetLike } from "@/redux-stores/slice/post";
import { fetchPostLikesApi } from "@/redux-stores/slice/post/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, Comment, disPatchResponse, NavigationProps, Post } from "@/types";
import { FlatList, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            post: Post
        }
    }
}

let totalFetchedItemCount = 0
let postId = "NO_ID"

const LikeScreen = memo(function LikeScreen({ navigation, route }: ScreenProps) {
    const post = route?.params?.post
    const likes = useSelector((Root: RootState) => Root.PostState.likesUserList)
    const likeLoading = useSelector((Root: RootState) => Root.PostState.likesLoading)
    const likesError = useSelector((Root: RootState) => Root.PostState.likesError)
    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchPostLikesApi({
                id: route?.params?.post?.id,
                offset: totalFetchedItemCount,
                limit: 12
            }) as any) as disPatchResponse<Comment[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [post.id])

    useEffect(() => {
        if (postId !== post.id) {
            postId = post.id
            totalFetchedItemCount = 0
            dispatch(resetLike())
            fetchApi()
        }
    }, [post.id])

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
        navigation.push("profile", { username })
    }, [])

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Likes" navigation={navigation} />
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
                    if (likeLoading === "idle") return <View />
                    if (likesError) return <ErrorScreen message={likesError} />
                    if (!likesError && likeLoading === "normal") return <ListEmpty text="No likes yet" />
                }}
                ListFooterComponent={likeLoading === "pending" ? <Loader size={50} /> : <></>}
                onRefresh={onRefresh} />
        </ThemedView>
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
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        onPress(data.username)
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                    <Text variant="H5">
                        {data.username}
                    </Text>
                </TouchableOpacity>
                <Text variantColor="secondary">
                    {data.name}
                </Text>
            </View>
        </View>
        {/* <Text variant="heading4" colorVariant="secondary">{isProfile ? 'You' : ''}</Text> */}
    </TouchableOpacity>)
}, (pre, next) => pre?.data?.id === next?.data?.id)