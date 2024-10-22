/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Avatar, Icon, Input, Text, TouchableOpacity, Separator, Loader, ThemedView } from "@/components/skysolo-ui";
import { FlatList, ToastAndroid, View, TouchableOpacity as RNTouchableOpacity } from "react-native";
import { timeAgoFormat } from "@/lib/timeFormat";
import { createPostCommentApi, fetchPostCommentsApi } from "@/redux-stores/slice/post/api.service";
import AppHeader from "@/components/AppHeader";
import { Comment, disPatchResponse, NavigationProps, NotificationType, Post } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { resetComments } from "@/redux-stores/slice/post";
import { SocketContext } from "@/provider/SocketConnections";
import { createNotificationApi } from "@/redux-stores/slice/notification/api.service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import React from "react";

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
let totalFetchedItemCount = 0
let postId = "NO_ID"

const CommentScreen = memo(function CommentScreen({ navigation, route }: CommentScreenProps) {
    const post = route?.params?.post
    const Comments = useSelector((Root: RootState) => Root.PostState.comments)
    const commentsLoading = useSelector((Root: RootState) => Root.PostState.commentsLoading)
    const commentsError = useSelector((Root: RootState) => Root.PostState.commentsError)
    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchPostCommentsApi({
                id: post.id,
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
            dispatch(resetComments())
            fetchApi()
        }
    }, [post.id])

    const onEndReached = useCallback(() => {
        if (stopRef.current || totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetComments())
        fetchApi()
    }, [])

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Comments" navigation={navigation} />
            <FlatList
                data={Comments}
                renderItem={({ item }) => <CommentItem data={item} navigation={navigation} />}
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
                    if (commentsLoading === "idle") return <View />
                    if (commentsError) return <ErrorScreen message={commentsError} />
                    if (!commentsError && commentsLoading === "normal") return <ListEmpty text="No Comments yet" />
                }}
                ListFooterComponent={commentsLoading === "pending" ? <Loader size={50} /> : <></>} />
            <CommentInput post={post} />
        </ThemedView>
    )
})
export default CommentScreen;

const CommentItem = memo(function CommentItem({
    data,
    navigation
}: {
    data: Comment,
    navigation: NavigationProps
}) {
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
                    navigation.push("profile", { username: data.user.username })
                }} />
            <View>
                <Text numberOfLines={readMore ? 100 : 3} ellipsizeMode="tail">
                    <RNTouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            navigation.push("profile", { username: data.user.username })
                        }}>
                        <Text variant="heading3" lineBreakMode="clip" numberOfLines={2}>
                            {data.user.name}{" "}
                        </Text>
                    </RNTouchableOpacity>
                    <Text variant="heading4"
                        colorVariant="secondary"
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
                    <Text variant="heading4" colorVariant="secondary">
                        {timeAgoFormat(data.createdAt)}
                    </Text>
                    <Text variant="heading4" colorVariant="default">
                        reply
                    </Text>
                    <Text variant="heading4" colorVariant="danger">
                        report
                    </Text>
                </View>
            </View>
        </View>
        <Icon iconName="Heart" size={24}
            onPress={() => {
                // navigation.push("profile", { username: data.user.username })
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
    post: Post,
}) {
    const SocketState = useContext(SocketContext)
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
        if (!session) return ToastAndroid.show("You need to login to comment", ToastAndroid.SHORT)
        if (!post?.id) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        try {
            loadingRef.current = true
            const commentRes = await dispatch(createPostCommentApi({
                postId: post.id,
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

            if (post.user.id === session.id) return reset()
            if (!commentRes.payload?.id) {
                reset()
                ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
                return
            }
            // notification
            const notificationRes = await dispatch(createNotificationApi({
                postId: post.id,
                commentId: commentRes.payload.id,
                authorId: session?.id,
                type: NotificationType.Comment,
                recipientId: post.user.id
            }) as any) as disPatchResponse<Notification>
            SocketState.sendDataToServer("notification_post", {
                ...notificationRes.payload,
                author: {
                    username: session.username,
                    profilePicture: session.profilePicture as string
                },
                post: {
                    id: post.id,
                    fileUrl: post.fileUrl,
                },
            })
            reset()
        } finally {
            loadingRef.current = false
        }
    }, [SocketState, post.fileUrl, post.id, post.user.id, session])


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
        </>
    )
}, () => true)