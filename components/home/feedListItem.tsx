/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useContext, useRef, useState } from 'react';
import { ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Avatar, Text, Image, Icon } from '@/components/skysolo-ui';
import { SocketContext } from '@/provider/SocketConnections';
import { createNotificationApi, destroyNotificationApi } from '@/redux-stores/slice/notification/api.service';
import { createPostLikeApi, destroyPostLikeApi } from '@/redux-stores/slice/post/api.service';
import { RootState } from '@/redux-stores/store';
import { disPatchResponse, NotificationType, Post } from '@/types';
import { Heart } from 'lucide-react-native';
import PagerView from 'react-native-pager-view';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '@/lib/debouncing';

const FeedItem = memo(function FeedItem({
    data,
    onNavigate
}: {
    data: Post,
    onNavigate: (path: string, options?: any) => void
}) {
    const navigateToProfile = useCallback(() => {
        if (!data.user) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        onNavigate("profile", { username: data.user.username })
    }, [data.user])

    const navigateToPost = useCallback((path: "post/like" | "post/comment", post: Post) => {
        if (!post) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        onNavigate(path, { post })
    }, [])

    return <View style={{
        width: "100%",
        paddingVertical: 14,
    }}>
        <View style={{
            marginHorizontal: "2%",
            paddingVertical: 10,
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <Avatar size={45} url={data.user?.profilePicture} onPress={navigateToProfile} />
            <View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={navigateToProfile} >
                    <Text
                        style={{ fontWeight: "600" }}
                        variant="heading3">
                        {data?.user?.name}
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{ fontWeight: "400" }}
                    colorVariant="secondary"
                    variant="heading4">
                    {`los angeles, CA`}
                </Text>
            </View>
        </View>
        <PagerView
            initialPage={0}
            style={{
                width: "100%",
                height: "auto",
                aspectRatio: 4 / 5, // portrait
                // aspectRatio: 9 / 16, // story
                // aspectRatio: 16 / 9,  // landscape
                // aspectRatio: 1 / 1, // square
            }}>
            {data.fileUrl.map((item, index) => (<ImageItem key={index} item={item} index={index} />))}
        </PagerView>
        {/* action */}
        <View>
            <FeedItemActionsButtons post={data} onPress={navigateToPost} />
            <View>
                {data?.content ? <Text variant="heading4" style={{
                    fontWeight: "500",
                    marginHorizontal: "2%",
                    marginTop: 5
                }}>{data?.content}</Text> : <View />}
            </View>
            <View>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigateToPost("post/comment", data)}>
                    <Text variant="heading4"
                        colorVariant="secondary"
                        style={{
                            marginHorizontal: "2%",
                            fontWeight: "400",
                            paddingVertical: 5
                        }}>
                        View all comments
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
}, () =>true)


export default FeedItem;

const FeedItemActionsButtons = (
    {
        post,
        onPress
    }: {
        onPress: (path: "post/like" | "post/comment", post: Post) => void,
        post: Post
    }
) => {
    const SocketState = useContext(SocketContext)
    const dispatch = useDispatch()
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const [like, setLike] = useState({
        isLike: post.is_Liked,
        likeCount: post.likeCount
    })
    const loading = useRef(false)

    const likeHandle = useCallback(async () => {
        if (loading.current) return
        try {
            loading.current = true
            if (!session) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            const res = await createPostLikeApi(post.id)
            if (!res) {
                return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
            }
            if (post.user.id === session.id) return
            const notificationRes = await dispatch(createNotificationApi({
                postId: post.id,
                authorId: session.id,
                type: NotificationType.Like,
                recipientId: post.user.id
            }) as any) as disPatchResponse<Notification>
            SocketState.sendDataToServer("notification_post", {
                ...notificationRes.payload,
                author: {
                    username: session?.username,
                    profilePicture: session?.profilePicture
                },
                post: {
                    id: post.id,
                    fileUrl: post.fileUrl[0].urls?.low,
                }
            })
        } catch (error) {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        } finally {
            loading.current = false
        }
    }, [post.fileUrl.length, post.id, post.user.id, session])

    const disLikeHandle = useCallback(async () => {
        if (loading.current) return
        try {
            loading.current = true
            if (!session) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            const res = await destroyPostLikeApi(post.id)
            if (!res) {
                return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
            }
            if (post.user.id === session.id) return
            await dispatch(destroyNotificationApi({
                postId: post.id,
                authorId: session.id,
                type: NotificationType.Like,
                recipientId: post.user.id
            }) as any)
        } catch (error: any) {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        } finally {
            loading.current = false
        }
    }, [post.id, post.user.id, session])


    const delayLike = useCallback(() => {
        if (like.isLike) {
            disLikeHandle()
        } else {
            likeHandle()
        }
    }, [like.isLike])

    const debounceLike = useDebounce(delayLike, 500)

    const onLike = useCallback(() => {
        if (like.isLike) {
            setLike({
                isLike: false,
                likeCount: like.likeCount - 1
            })
        } else {
            setLike({
                isLike: true,
                likeCount: like.likeCount + 1
            })
        }
        debounceLike()
    }, [like.isLike, like.likeCount])

    const AData = [
        {
            iconName: "MessageCircle",
            count: post.commentCount,
            size: 30,
            onPress: () => onPress("post/comment", post),
        },
        {
            iconName: "Send",
            count: "",
            size: 28,
            onPress: () => { },
        },
    ]
    return (
        <View style={{
            display: 'flex',
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: "2%",
            paddingTop: 10,
            gap: 10
        }}>
            <View style={{
                display: 'flex',
                flexDirection: "row",
                gap: 18
            }}>
                <View style={{
                    display: 'flex',
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center"
                }} key={"like"}>
                    {!like.isLike ? <Icon iconName={"Heart"} size={30} onPress={onLike} /> :
                        <Heart size={30} fill={like.isLike ? "red" : ""} onPress={onLike} />}
                    <TouchableOpacity onPress={() => onPress("post/like", post)} >
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600"
                        }}>
                            {like.likeCount}
                        </Text>
                    </TouchableOpacity>
                </View>
                {AData.map((item, index) => (
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center"
                    }} key={index}>
                        <Icon iconName={item.iconName as any}
                            size={item.size}
                            onPress={item.onPress}
                            style={{
                                transform: [{ rotateY: item.iconName === "MessageCircle" ? "180deg" : "0deg" }]
                            }} />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600"
                        }}>{item.count}</Text>
                    </View>
                ))}
            </View>
            <Icon iconName="Bookmark" size={30} />
        </View>
    )
}
const ImageItem = memo(function ImageItem({ item, index }: { item: any, index: number }) {
    return <Image
        key={index}
        isBorder
        url={item.urls?.high}
        style={{
            width: "100%",
            flex: 1,
            borderRadius: 0,
        }} />
}, (prev, next) => {
    return prev.item.id === next.item.id
})