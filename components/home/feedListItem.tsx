/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useContext, useRef, useState } from 'react';
import { ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Avatar, Text, Image, Icon } from '@/components/skysolo-ui';
import { SocketContext } from '@/provider/SocketConnections';
import { createNotificationApi, destroyNotificationApi } from '@/redux-stores/slice/notification/api.service';
import { createPostLikeApi, destroyPostLikeApi } from '@/redux-stores/slice/post/api.service';
import { RootState } from '@/redux-stores/store';
import { disPatchResponse, NavigationProps, NotificationType, Post } from '@/types';
import { Heart } from 'lucide-react-native';
import PagerView from 'react-native-pager-view';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '@/lib/debouncing';

const FeedItem = memo(function FeedItem({
    data,
    navigation
}: {
    data: Post,
    navigation: NavigationProps
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [tabIndex, setTabIndex] = useState(0)
    const imageLength = data.fileUrl.length
    const navigateToProfile = useCallback(() => {
        if (!data.user) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        navigation.push("profile", { username: data.user.username })
    }, [data.user])

    const navigateToPost = useCallback((path: "post/like" | "post/comment", post: Post) => {
        if (!post) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        navigation.push(path, { post, index: 0 })
    }, [])

    return <View style={{
        width: "100%",
        paddingVertical: 14,
    }}>
        {/* header */}
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
        {/* view image */}
        <View style={{
            width: "100%",
            height: "auto",
            aspectRatio: 4 / 5,
        }}>
            {/* indicator */}
            {imageLength > 1 ? <View style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "auto",
                backgroundColor: "rgba(0,0,0,0.6)",
                zIndex: 10,
                borderRadius: 10,
                margin: 10,
                paddingHorizontal: 4,
            }}>
                <Text variant="heading4" style={{
                    fontWeight: "400",
                    color: "white",
                    padding: 5,
                    fontSize: 16
                }}>
                    {tabIndex + 1}/{imageLength}
                </Text>
            </View> : <View />}
            {/* image */}
            <PagerView
                initialPage={tabIndex}
                onPageSelected={(e) => setTabIndex(e.nativeEvent.position)}
                style={{
                    width: "100%",
                    height: "100%",
                }}>
                {data.fileUrl.map((item, index) => (<ImageItem key={index} item={item} index={index} />))}
            </PagerView>
        </View>
        {imageLength > 1 ? <View style={{
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 10,
            borderRadius: 10,
            margin: 2,
            padding: 4,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
        }}>
            {Array.from({ length: imageLength }).map((_, index) => (
                <View key={index} style={{
                    width: 7,
                    height: 7,
                    borderRadius: 14,
                    backgroundColor: index === tabIndex ? currentTheme?.primary : currentTheme?.muted,
                    margin: 2
                }} />
            ))}
        </View> : <View />}
        {/* action */}
        <View>
            <FeedItemActionsButtons post={data} onPress={navigateToPost} />
            {/* text */}
            <FeedItemContent data={data} navigation={navigation} />
            <View>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigateToPost("post/comment", data)}>
                    <Text
                        variant="heading4"
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
}, () => true)

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
const FeedItemContent = memo(function FeedItemContent({ data,
    navigation
}: {
    data: Post,
    navigation: NavigationProps
}) {
    const [readMore, setReadMore] = useState(false)

    if (data.content.length <= 0) {
        return <></>
    }
    return (<Text numberOfLines={readMore ? 100 : 3}
        style={{
            alignItems: "center",
            marginHorizontal: "2%",
        }}
        ellipsizeMode="tail">
        <TouchableWithoutFeedback
            style={{
                borderWidth: 0.5,
                borderColor: "red",
            }}
            onPress={() => {
                navigation.push("profile", { username: data.user.username })
            }}>
            <Text variant="heading4"
                style={{
                    fontWeight: "500",
                    fontSize: 16
                }}
                lineBreakMode="clip" numberOfLines={2}>
                {data.user.name}{" "}
            </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setReadMore(!readMore)}>
            <Text variant="heading4"
                colorVariant="secondary"
                style={{
                    marginHorizontal: "2%",
                    fontWeight: "400",
                    paddingVertical: 5,
                    fontSize: 14
                }}
                numberOfLines={readMore ? 100 : 2}>
                {data.content}
            </Text>
        </TouchableWithoutFeedback>
    </Text>)
}, () => true)