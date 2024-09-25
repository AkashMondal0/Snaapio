import { Avatar, Text, Image, Icon } from '@/components/skysolo-ui';
import { SocketContext } from '@/provider/SocketConnections';
import { createNotificationApi, destroyNotificationApi } from '@/redux-stores/slice/notification/api.service';
import { createPostLikeApi, destroyPostLikeApi } from '@/redux-stores/slice/post/api.service';
import { RootState } from '@/redux-stores/store';
import { disPatchResponse, NotificationType, Post } from '@/types';
import { Heart } from 'lucide-react-native';
import { memo, useCallback, useContext, useRef, useState } from 'react';
import { ToastAndroid, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useDispatch, useSelector } from 'react-redux';

const FeedItem = memo(function FeedItem({
    data,
    onPress,
    onNavigate
}: {
    data: Post,
    onNavigate: (username: string) => void,
    onPress: (post: Post, path: "post/like" | "post/comment") => void,
}) {

    return <View style={{
        width: "100%",
        paddingVertical: 14,
        // borderBottomWidth: 0.2,
    }}>
        <View style={{
            marginHorizontal: "3%",
            paddingVertical: 10,
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <Avatar size={45} url={data.user?.profilePicture}
                onPress={() => onNavigate(data.user?.username)} />
            <View>
                <Text
                    style={{ fontWeight: "600" }}
                    variant="heading3">
                    {data?.user?.name}
                </Text>
                <Text
                    style={{
                        fontWeight: "400",
                    }}
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
                minHeight: 460,
            }}>
            {data.fileUrl.map((mediaUrl, index) => (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} key={index}>
                    <Image
                        isBorder
                        url={mediaUrl}
                        style={{
                            width: "96%",
                            flex: 1,
                            borderRadius: 20
                        }} />
                </View>
            ))}
        </PagerView>
        {/* action */}
        <View>
            <FeedItemActionsButtons post={data} onPress={onPress} />
            <View style={{
                marginHorizontal: "3%",
            }}>
                {data?.content ? <Text variant="heading4" style={{
                    fontWeight: "600"
                }}>{data?.content}</Text> : <></>}
            </View>
            <View>
                <TouchableOpacity activeOpacity={0.5} onPress={() => onPress(data, "post/comment")} >
                    <Text variant="heading4"
                        colorVariant="secondary"
                        style={{
                            marginHorizontal: "3%",
                            fontWeight: "400",
                            paddingVertical: 5
                        }}>
                        View all comments
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
}, (prev, next) => {
    return prev.data.id === next.data.id
})


export default FeedItem;

const FeedItemActionsButtons = (
    {
        post,
        onPress
    }: {
        onPress: (post: Post, path: "post/like" | "post/comment") => void,
        post: Post
    }
) => {
    const dispatch = useDispatch()
    const SocketState = useContext(SocketContext)
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
            const res = await dispatch(createPostLikeApi(post.id) as any) as disPatchResponse<any>
            if (res.error) {
                return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
            }
            setLike((pre) => ({ ...pre, isLike: true, likeCount: pre.likeCount + 1 }))
            if (post.user.id === session.id) return
            // const notificationRes = await dispatch(createNotificationApi({
            //     postId: post.id,
            //     authorId: session.id,
            //     type: NotificationType.Like,
            //     recipientId: post.user.id
            // }) as any) as disPatchResponse<Notification>
            // SocketState.sendDataToServer(event_name.notification.post, {
            //     ...notificationRes.payload,
            //     author: {
            //         username: session.data?.user.username,
            //         profilePicture: session.data?.user.image
            //     },
            //     post: {
            //         id: post.id,
            //         fileUrl: post.fileUrl,
            //     }
            // })
        } catch (error) {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        } finally {
            loading.current = false
        }
    }, [SocketState, post.fileUrl, post.id, post.user.id, session?.id])

    const disLikeHandle = useCallback(async () => {
        if (loading.current) return
        try {
            loading.current = true
            if (!session) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            const res = await dispatch(destroyPostLikeApi(post.id) as any) as disPatchResponse<any>
            if (res.error) {
                return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
            }
            setLike((pre) => ({ ...pre, isLike: false, likeCount: pre.likeCount - 1 }))
            if (post.user.id === session.id) return
            await dispatch(destroyNotificationApi({
                postId: post.id,
                authorId: session.id,
                type: NotificationType.Like,
                recipientId: post.user.id
            }) as any)
        } catch (error) {
            ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        } finally {
            loading.current = false
        }
    }, [post.id, post.user.id, session?.id])


    const onLike = () => {
        if (like.isLike) {
            disLikeHandle()
        } else {
            likeHandle()
        }
    }

    const AData = [
        {
            iconName: "MessageCircle",
            count: post.commentCount,
            size: 30,
            onPress: () => onPress(post, "post/comment"),
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
            marginHorizontal: "3%",
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
                    <TouchableOpacity onPress={() => onPress(post, "post/like")} >
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
                                // transform: [{ rotateY: item.iconName === "MessageCircle" ? "180deg" : "0deg" }]
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