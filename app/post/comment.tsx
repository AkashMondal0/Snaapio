import AppHeader from "@/components/AppHeader";
import { Avatar, Icon, Input, Text, TouchableOpacity, Separator, Loader } from "@/components/skysolo-ui";
import { timeAgoFormat } from "@/lib/timeFormat";
import { fetchPostCommentsApi } from "@/redux-stores/slice/post/api.service";
import { Comment, disPatchResponse, NavigationProps, Post } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { resetComments } from "@/redux-stores/slice/post";
import debounce from "@/lib/debouncing";
import { ListEmptyComponent } from "@/components/home";

interface CommentScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            post: Post
        }
    }
}

const CommentScreen = memo(function CommentScreen({ navigation, route }: CommentScreenProps) {
    const Comments = useSelector((Root: RootState) => Root.PostState.comments)
    const commentsLoading = useSelector((Root: RootState) => Root.PostState.commentsLoading)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const totalFetchedItemCount = useRef<number>(0)
    const [firstFetchAttend, setFirstFetchAttend] = useState(true)


    const fetchCommentsApi = useCallback(async (reset?: boolean) => {
        if (stopRef.current || totalFetchedItemCount.current === -1) return
        // console.log('fetching more posts', totalFetchedItemCount.current)
        try {
            const res = await dispatch(fetchPostCommentsApi({
                id: route?.params?.post?.id,
                offset: reset ? 0 : totalFetchedItemCount.current,
                limit: 12
            }) as any) as disPatchResponse<Comment[]>
            if (res.payload?.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload?.length < 12) {
                    return totalFetchedItemCount.current = -1
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount.current += res.payload.length
            }
        } finally {
            if (firstFetchAttend) {
                setFirstFetchAttend(false)
            }
            stopRef.current = false
        }
    }, [route?.params?.post?.id])


    const onPress = (item: Comment) => {
        console.log('item', item)
    }

    const fetchComments = debounce(fetchCommentsApi, 1000)

    const onRefresh = useCallback(() => {
        totalFetchedItemCount.current = 0
        dispatch(resetComments())
        fetchCommentsApi(true)
    }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Comments" navigation={navigation} />
            <FlashList
                data={Comments}
                renderItem={({ item }) => <CommentItem data={item} onPress={onPress} />}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={fetchComments}
                refreshing={false}
                onRefresh={onRefresh}
                ListFooterComponent={() => <>{commentsLoading || !commentsLoading && firstFetchAttend ? <Loader size={50} /> : <></>}</>}
                ListEmptyComponent={!firstFetchAttend && Comments.length <= 0 ? <ListEmptyComponent text="No Comments yet" /> : <></>} />
            <Separator value={0.8} />
            <View
                style={{
                    width: "100%",
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.6%",
                    borderBottomWidth: 0.8,
                }}>
                <Input placeholder="Add a comment"
                    secondaryColor
                    multiline
                    style={{
                        width: "84%",
                        height: "100%",
                        borderRadius: 18,
                        borderWidth: 0,
                        maxHeight: 100,
                    }} />
                <Icon iconName={"Send"}
                    isButton size={26}
                    style={{
                        padding: "4%",
                        width: "auto",
                        height: 45,
                    }} />
            </View>
        </View>
    )
})
export default CommentScreen;

const CommentItem = memo(function CommentItem({
    data, onPress
}: {
    data: Comment,
    onPress: (item: Comment) => void
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
            <Avatar source={{ uri: data.user.profilePicture }} size={50}
                onPress={() => onPress(data)} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Text variant="heading3">{data.user.name}</Text>
                    <Text variant="heading4">{data.content}</Text>
                </View>
                <Text variant="heading4" colorVariant="secondary">{timeAgoFormat(data?.createdAt)}</Text>
            </View>
        </View>
        <Icon iconName="Heart" size={24} onPress={() => onPress(data)} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})