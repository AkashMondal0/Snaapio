import { memo, useCallback, useState } from 'react';
import { ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Post } from '@/types';
import PagerView from 'react-native-pager-view';
import { useTheme, Text } from 'hyper-native-ui';
import { Avatar } from '@/components/skysolo-ui';
import React from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
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
import FeedItemContent from './feedItemContent';
import FeedItemImage from './feedItemImage';
import FeedItemActionsButtons from './feedItemActionsButtons';

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
                        {data.fileUrl.map((item, index) => (<FeedItemImage key={index} item={item} index={index} />))}
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
