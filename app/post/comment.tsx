import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { FlatList, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import { timeAgoFormat } from "@/lib/timeFormat";
import { createPostCommentApi, fetchOnePostApi, fetchPostCommentsApi } from "@/redux-stores/slice/post/api.service";
import AppHeader from "@/components/AppHeader";
import { Comment, disPatchResponse, loadingType, NotificationType, Post } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { resetComments } from "@/redux-stores/slice/post";
import { createNotificationApi } from "@/redux-stores/slice/notification/api.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import React from "react";
import { Input, Text, TouchableOpacity, Separator, Loader } from "hyper-native-ui";
import { StackActions, StaticScreenProps, useNavigation } from "@react-navigation/native";
import UserItemLoader from "@/components/loader/user-loader";

const schema = z.object({
    text: z.string().min(1)
})
type Props = StaticScreenProps<{
    id: string;
}>;
let totalFetchedItemCount = 0
let postId = "NO_ID"
let Postdata: Post;

const CommentScreen = memo(function CommentScreen({ route }: Props) {
    const _postId = route?.params?.id;
    // const Comments = useSelector((Root: RootState) => Root.PostState.comments)
    // const commentsLoading = useSelector((Root: RootState) => Root.PostState.commentsLoading)
    // const commentsError = useSelector((Root: RootState) => Root.PostState.commentsError)
    // const stopRef = useRef(false)
    // const dispatch = useDispatch()
    // const [state, setState] = useState<{
    //     loading: loadingType,
    //     error: boolean,
    //     data: Post | null
    // }>({
    //     data: null,
    //     error: false,
    //     loading: "idle"
    // })

    // const fetchApi = useCallback(async () => {
    //     if (stopRef.current || totalFetchedItemCount === -1) return
    //     stopRef.current = true
    //     try {
    //         const postRes = await dispatch(fetchOnePostApi(postId) as any) as disPatchResponse<Post>
    //         if (postRes.error) return setState({ ...state, loading: "normal", error: true })
    //         if (!postRes.payload.id) {
    //             setState((pre) => ({ ...pre, error: true, loading: "normal" }))
    //             return
    //         }
    //         setState({ ...state, loading: "normal", data: postRes.payload })
    //         Postdata = postRes.payload
    //         const res = await dispatch(fetchPostCommentsApi({
    //             id: _postId,
    //             offset: totalFetchedItemCount,
    //             limit: 12
    //         }) as any) as disPatchResponse<Comment[]>
    //         if (res.payload.length >= 12) {
    //             totalFetchedItemCount += res.payload.length
    //             return
    //         }
    //         totalFetchedItemCount = -1
    //     } finally {
    //         stopRef.current = false
    //     }
    // }, [_postId])

    // useEffect(() => {
    //     if (postId !== _postId) {
    //         postId = _postId
    //         totalFetchedItemCount = 0
    //         dispatch(resetComments())
    //         fetchApi()
    //     } else {
    //         setState({ ...state, loading: "normal", data: Postdata })
    //     }
    // }, [_postId, postId])

    // const onEndReached = useCallback(() => {
    //     if (stopRef.current || totalFetchedItemCount < 10) return
    //     fetchApi()
    // }, [])

    // const onRefresh = useCallback(() => {
    //     totalFetchedItemCount = 0
    //     dispatch(resetComments())
    //     fetchApi()
    // }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Comments" />
            <FlatList
                data={Comments}
                renderItem={({ item }) => <CommentItem data={item} />}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                refreshing={false}
                onRefresh={onRefresh}
                ListEmptyComponent={() => {
                    if (commentsLoading === "idle" || commentsLoading === "pending") return <UserItemLoader size={10} />
                    if (commentsError) return <ErrorScreen message={commentsError} />
                    if (!commentsError && commentsLoading === "normal" && state.loading === "normal") return <ListEmpty text="No Comments yet" />
                }}
                ListFooterComponent={commentsLoading === "pending" ? <Loader size={50} /> : <></>} />
            <CommentInput post={state.data} />
        </View>
    )
})
export default CommentScreen;

const CommentItem = memo(function CommentItem({
    data,
}: {
    data: Comment
}) {
    const navigation = useNavigation()
    const [readMore, setReadMore] = useState(false)
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
})

const CommentInput = memo(function CommentInput({
    post
}: {
    post: Post | null
}) {
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const loading = useSelector((Root: RootState) => Root.PostState.createCommentLoading)
    const { control, reset, handleSubmit } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { text: "" }
    });
    const loadingRef = useRef(false)
    const dispatch = useDispatch()

    const handleComment = useCallback(async (_data: { text: string }) => {
        if (_data.text.length <= 0 || loadingRef.current) return
        if (!post?.id) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        if (!session) return ToastAndroid.show("You need to login to comment", ToastAndroid.SHORT)
        try {
            loadingRef.current = true
            const commentRes = await dispatch(createPostCommentApi({
                postId: post.id,
                user: {
                    username: session.username,
                    name: session.name ?? session.username,
                    profilePicture: session.profilePicture as string,
                    id: session.id,
                    email: session.email
                },
                content: _data.text,
                authorId: session.id
            }) as any) as disPatchResponse<Comment>

            if (post.user.id === session.id) return reset()
            if (!commentRes.payload?.id) {
                reset()
                ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
                return
            }
            // notification
            await dispatch(createNotificationApi({
                postId: post.id,
                commentId: commentRes.payload.id,
                authorId: session?.id,
                type: NotificationType.Comment,
                recipientId: post.user.id,
                author: {
                    username: session?.username,
                    profilePicture: session?.profilePicture
                },
                post: {
                    id: post.id,
                    fileUrl: post.fileUrl[0].urls?.low,
                }
            }) as any) as disPatchResponse<Notification>
            reset()
        } finally {
            loadingRef.current = false
        }
    }, [post?.fileUrl, post?.id, post?.user.id, session])


    return (
        <>
            <Separator value={0.8} />
            <View
                style={{
                    width: "100%",
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.6%",
                    gap: "1.2%"
                }}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input placeholder="Type a message"
                            // variant="secondary"
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
        </>
    )
}, (pre, next) => pre.post?.id === next.post?.id)