import { memo, useCallback, useState } from 'react';
import { ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Assets, Post } from '@/types';
import { Heart } from 'lucide-react-native';
import PagerView from 'react-native-pager-view';
import useDebounce from '@/lib/debouncing';
import { useTheme, Text } from 'hyper-native-ui';
import { Avatar, Image, Icon } from '@/components/skysolo-ui';
import React from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { QPost } from '@/redux-stores/slice/post/post.queries';
import { useGQMutation } from '@/lib/useGraphqlQuery';
import Animated, {
    useSharedValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import {
    GestureHandlerRootView,
    PinchGestureHandler,
} from 'react-native-gesture-handler';

const FeedItem = memo(function FeedItem({
    data
}: {
    data: Post
}) {
    const navigation = useNavigation();
    const { currentTheme } = useTheme();
    const [tabIndex, setTabIndex] = useState(0);
    const imageLength = data.fileUrl.length;

    const scale = useSharedValue(1); // Scale state

    // Gesture Handler
    const pinchHandler: any = useAnimatedGestureHandler({
        onActive: (event: any) => {
            scale.value = Math.max(1, Math.min(event.scale, 3)); // Restrict scale
        },
        onEnd: () => {
            scale.value = withSpring(1); // Reset smoothly
        },
    });

    // Animated Style
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const navigateToProfile = useCallback(() => {
        if (!data.user) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
        navigation.dispatch(StackActions.push("Profile", { id: data.user.username }));
    }, [data?.user]);

    if (!data?.user || !data.id) return <></>

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
            gap: 6
        }}>
            <Avatar size={52} url={data.user?.profilePicture} onPress={navigateToProfile} />
            <View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={navigateToProfile} >
                    <Text style={{ fontWeight: "600" }}>
                        {data?.user?.name}
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{ fontWeight: "400" }}
                    variantColor="secondary"
                    variant="body2">
                    {`los angeles, CA`}
                </Text>
            </View>
        </View>
        {/* view image */}
        <GestureHandlerRootView style={{
            flex: 1
        }}>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
                <Animated.View style={[{
                    width: "100%",
                    aspectRatio: 4 / 5
                }, animatedStyle]}>
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
                        <Text variant="H6" style={{
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
                </Animated.View>
            </PinchGestureHandler>
        </GestureHandlerRootView>

        {/* indicator */}
        {imageLength > 1 ? <View style={{
            width: "100%",
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
            <FeedItemActionsButtons post={data} />
            {/* text */}
            <FeedItemContent data={data} />
            <View>
                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                    navigation.dispatch(StackActions.push("PostComment", { id: data.id }))
                }}>
                    <Text
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
    }: {
        post: Post
    }
) => {
    const navigation = useNavigation();
    const [like, setLike] = useState({
        isLike: post.is_Liked,
        likeCount: post.likeCount
    })

    const { mutate } = useGQMutation<boolean>({
        mutation: QPost.createAndDestroyLike,
        onError: (err) => {
            setLike((pre) => ({
                isLike: !pre.isLike,
                likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
            }));
        }
    });

    const delayLike = useCallback((value: boolean) => {
        if (!post?.id) return;
        mutate({ input: { id: post?.id, like: value } })
    }, [post?.id])

    const debounceLike = useDebounce(delayLike, 500)

    const onLike = useCallback(() => {
        setLike((pre) => ({
            isLike: !pre.isLike,
            likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
        }))
        debounceLike(!like.isLike)
    }, [like.isLike, like.likeCount])

    const AData = [
        {
            iconName: "MessageCircle",
            count: post.commentCount,
            size: 30,
            onPress: () => navigation.dispatch(StackActions.push("PostComment", { id: post.id })),
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
                    <TouchableOpacity onPress={() => navigation.navigate("PostLike", { id: post.id })} >
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
const ImageItem = memo(function ImageItem({ item, index }: { item: Assets, index: number }) {
    return <Image
        key={index}
        isBorder
        url={item.original}
        blurUrl={item.blur_original}
        fastLoad
        style={{
            width: "100%",
            flex: 1,
            borderRadius: 0,
        }} />
}, (prev, next) => {
    return prev.item.id === next.item.id
})

const FeedItemContent = memo(function FeedItemContent({ data
}: {
    data: Post,
}) {
    const navigation = useNavigation();
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
                navigation.navigate("Profile", { id: data.user.username })
            }}>
            <Text
                style={{
                    fontWeight: "500",
                    fontSize: 16
                }}
                lineBreakMode="clip" numberOfLines={2}>
                {data.user.name}{" "}
            </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => setReadMore(!readMore)}>
            <Text
                variantColor='secondary'
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

export const FeedLoader = ({ size }: { size?: number }) => {
    const { currentTheme } = useTheme();
    const background = currentTheme.input;
    return <View>
        {Array(size ?? 4).fill(0).map((_, i) =>
            <View key={i}
                style={{
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
                    gap: 6
                }}>
                    <View
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 120,
                            backgroundColor: background
                        }}
                    />
                    <View style={{
                        gap: 5
                    }}>
                        <View
                            style={{
                                width: 180,
                                height: 14,
                                borderRadius: 50,
                                backgroundColor: background
                            }}
                        />
                        <View
                            style={{
                                width: 120,
                                height: 12,
                                borderRadius: 50,
                                backgroundColor: background
                            }}
                        />
                    </View>
                </View>
                {/* view image */}
                <View
                    style={{
                        aspectRatio: 4 / 5,
                        flex: 1,
                        padding: 4,
                        width: "100%",
                        height: "100%",
                        borderRadius: 0,
                        backgroundColor: background
                    }} />
                {/* action */}
                <View style={{
                    gap: 6,
                    marginHorizontal: "2%",
                    paddingVertical: 10
                }}>
                    <View style={{
                        width: 200,
                        height: 16,
                        borderRadius: 50,
                        backgroundColor: background
                    }} />
                    <View style={{
                        width: 120,
                        height: 14,
                        borderRadius: 50,
                        backgroundColor: background
                    }} />
                </View>
            </View>)}
    </View>
}