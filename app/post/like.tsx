import AppHeader from "@/components/AppHeader";
import { Avatar, Loader, Text, TouchableOpacity } from "@/components/skysolo-ui";
import debounce from "@/lib/debouncing";
import { resetLike } from "@/redux-stores/slice/post";
import { fetchPostLikesApi } from "@/redux-stores/slice/post/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, Comment, disPatchResponse, NavigationProps, Post } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
interface CommentScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            post: Post
        }
    }
}


const LikeScreen = memo(function LikeScreen({ navigation, route }: CommentScreenProps) {
    const likes = useSelector((Root: RootState) => Root.PostState.likesUserList)
    const likeLoading = useSelector((Root: RootState) => Root.PostState.likesLoading)
    const [refreshing, setRefreshing] = useState(false)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const totalFetchedItemCount = useRef<number>(0)


    const fetchLikesApi = useCallback(async (reset?: boolean) => {
        // console.log('fetching more posts', totalFetchedItemCount)
        if (stopRef.current || totalFetchedItemCount.current === -1) return
        // if () return setFinishedFetching(true)
        try {
            const res = await dispatch(fetchPostLikesApi({
                id: route?.params?.post?.id,
                offset: reset ? 0 : totalFetchedItemCount.current,
                limit: 12
            }) as any) as disPatchResponse<Comment[]>

            // console.log('fetching more posts', res.)
            if (res.payload?.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload?.length < 12) {
                    return totalFetchedItemCount.current = -1
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount.current += res.payload.length
            }
        } finally {
            stopRef.current = false
        }
    }, [route?.params?.post?.id])


    const onPress = (item: AuthorData) => {
        console.log('item', item)
    }

    const fetchLikes = debounce(fetchLikesApi, 1000)

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        totalFetchedItemCount.current = 0
        dispatch(resetLike())
        await fetchLikesApi(true)
        setRefreshing(false)
    }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Likes" navigation={navigation} />
            <FlashList
                data={likes}
                renderItem={({ item }) => (<LikeItem data={item}
                    isProfile={item.id === route?.params?.post?.user.id}
                    onPress={onPress} />)}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => <>{likeLoading ? <Loader size={50} /> : <></>}</>}
                ListEmptyComponent={likeLoading ? <></> : ListEmptyComponent}
                estimatedItemSize={100}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={fetchLikes}
                refreshing={refreshing}
                onRefresh={onRefresh} />
        </View>
    )
})
export default LikeScreen;

const LikeItem = memo(function CommentItem({
    data,
    isProfile,
    onPress
}: {
    data: AuthorData,
    isProfile: boolean,
    onPress: (item: AuthorData) => void
}) {
    return (<TouchableOpacity style={{
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
            <Avatar source={{ uri: data.profilePicture }} size={50}
                onPress={() => onPress(data)} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Text variant="heading3">
                        {data.username}
                    </Text>
                </View>
                <Text variant="heading4" secondaryColor>
                    {data.name}
                </Text>
            </View>
        </View>
        <Text variant="heading4" secondaryColor>{isProfile ? 'You' : ''}</Text>
    </TouchableOpacity>)
})

const ListEmptyComponent = () => {

    return (
        <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            width: '100%',
            flex: 1,
        }}>
            <Text variant="heading3">
                No likes yet
            </Text>
        </View>
    )
}