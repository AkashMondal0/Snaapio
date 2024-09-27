import AppHeader from "@/components/AppHeader";
import { Avatar, Icon, Input, Text, TouchableOpacity, Separator, Loader } from "@/components/skysolo-ui";
import { timeAgoFormat } from "@/lib/timeFormat";
import { createPostCommentApi, fetchPostCommentsApi } from "@/redux-stores/slice/post/api.service";
import { Comment, disPatchResponse, NavigationProps, NotificationType, Post } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useContext, useRef, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { resetComments } from "@/redux-stores/slice/post";
import debounce from "@/lib/debouncing";
import { ListEmptyComponent } from "@/components/home";
import { SocketContext } from "@/provider/SocketConnections";
import { createNotificationApi } from "@/redux-stores/slice/notification/api.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
const schema = z.object({
    text: z.string().min(1)
})
interface CommentScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            post: Post
        }
    }
}

const CommentScreen = memo(function CommentScreen({ navigation, route }: CommentScreenProps) {
    const data = route?.params?.post
    const Comments = useSelector((Root: RootState) => Root.PostState.comments)
    const commentsLoading = useSelector((Root: RootState) => Root.PostState.commentsLoading)
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const totalFetchedItemCount = useRef<number>(0)
    const [firstFetchAttend, setFirstFetchAttend] = useState(true)
    const SocketState = useContext(SocketContext)
    const stopRef = useRef(false)
    const loadingRef = useRef(false)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const { control, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            text: "",
        }
    });

    const handleComment = useCallback(async (_data: { text: string }) => {
        if (_data.text.length <= 0 || loadingRef.current) return
        setLoading(true)
        if (!session) return ToastAndroid.show("You need to login to comment", ToastAndroid.SHORT)
        if (!data?.id) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        try {
            loadingRef.current = true
            const commentRes = await dispatch(createPostCommentApi({
                postId: data.id,
                user: {
                    username: session.username,
                    name: session.name,
                    profilePicture: session.profilePicture as string,
                    id: session.id,
                    email: session.email
                },
                content: _data.text,
                authorId: session.id
            }) as any) as disPatchResponse<Comment>

            if (data.user.id === session.id) return reset()
            if (commentRes.payload.id) {
                // notification
                const notificationRes = await dispatch(createNotificationApi({
                    postId: data.id,
                    commentId: commentRes.payload.id,
                    authorId: session?.id,
                    type: NotificationType.Comment,
                    recipientId: data.user.id
                }) as any) as disPatchResponse<Notification>
                SocketState.sendDataToServer("notification_post", {
                    ...notificationRes.payload,
                    author: {
                        username: session.username,
                        profilePicture: session.profilePicture as string
                    },
                    post: {
                        id: data.id,
                        fileUrl: data.fileUrl,
                    },
                })
                reset()
            } else {
                ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
            }
        } finally {
            loadingRef.current = false
            setLoading(false)
        }
    }, [SocketState, data.fileUrl, data.id, data.user.id, session])

    const fetchCommentsApi = useCallback(async (reset?: boolean) => {
        if (stopRef.current || totalFetchedItemCount.current === -1) return
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
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input placeholder="Type a message"
                            secondaryColor
                            multiline
                            disabled={loading}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            returnKeyType="send"
                            onSubmitEditing={handleSubmit(handleComment)}
                            style={{
                                width: "84%",
                                height: "100%",
                                borderRadius: 18,
                                borderWidth: 0,
                                maxHeight: 100,
                            }} />
                    )}
                    name="text"
                    rules={{ required: true }} />
                <Icon iconName={"Send"}
                    isButton size={26}
                    disabled={loading}
                    onPress={handleSubmit(handleComment)}
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
            <Avatar url={data.user.profilePicture} size={50}
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