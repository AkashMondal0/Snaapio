import { View, Text as RNText, TouchableOpacity, Animated } from "react-native"
import { Icon, Separator, Text, AnimatedView } from '@/components/skysolo-ui';
import { NavigationProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { setOffNotificationPopup, setOnNotificationPopup } from "@/redux-stores/slice/notification";
import { useEffect, useRef } from "react";
import { Heart, MessageCircle } from "lucide-react-native";
let initial = false


const HomeHeader = ({ navigation, translateY }: {
    navigation: NavigationProps,
    translateY: any
}) => {
    const unreadChatCount = useSelector((state: RootState) => state.NotificationState.unreadChatCount)
    const unreadCommentCount = useSelector((state: RootState) => state.NotificationState.unreadCommentCount)
    const unreadPostLikeCount = useSelector((state: RootState) => state.NotificationState.unreadPostLikeCount)



    return <AnimatedView style={[{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1,
        width: '100%',
        elevation: 0,
    }, { transform: [{ translateY }] }]}>
        <View style={{
            width: '100%',
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
        }}>
            <Text variant="heading2" style={{
                fontWeight: "700",
                padding: "3%",
                paddingVertical: 14
            }}>SkyLight</Text>
            <View style={{
                flexDirection: "row",
                gap: 14,
                padding: 10,
                alignItems: "center",
                marginHorizontal: 10
            }}>
                <NotificationPopup />
                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate("notification")
                    }} >
                    <View style={{
                        position: "absolute",
                        right: 0,
                        top: 1,
                        backgroundColor: unreadCommentCount > 0 || unreadPostLikeCount > 0 ? "red" : "transparent",
                        borderRadius: 50,
                        width: 8,
                        height: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1
                    }}>
                    </View>
                    <Icon iconName="Heart" size={30} onPress={() => {
                        navigation.navigate("notification")
                    }} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate("message")
                    }}
                    style={{
                        width: 35,
                        height: 35,
                    }}>
                    <View style={{
                        position: "absolute",
                        right: -2,
                        top: -5,
                        backgroundColor: unreadChatCount > 0 ? "red" : "transparent",
                        borderRadius: 50,
                        width: 20,
                        height: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1
                    }}>
                        {unreadChatCount > 0 ? <RNText style={{
                            color: "white",
                            fontSize: 14,
                            fontWeight: "500",
                        }}>
                            {unreadChatCount}
                        </RNText> : <></>}
                    </View>
                    <Icon iconName="MessageCircleCode" size={32} onPress={() => {
                        navigation.navigate("message")
                    }} />
                </TouchableOpacity>
            </View>
        </View>
        <Separator style={{ zIndex: -1 }} />
    </AnimatedView>
}

export default HomeHeader

const NotificationPopup = () => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const notifications = useSelector((state: RootState) => state.NotificationState)
    const dispatch = useDispatch()

    const scaleAnimation = (value: 0 | 1) => {
        Animated.timing(scaleValue, {
            toValue: value, // Scale to 1
            duration: 400, // Duration of the animation
            useNativeDriver: true, // Improves performance
        }).start();
    };

    useEffect(() => {
        const time = setTimeout(() => {
            if (!initial) {
                if (notifications.unreadPostLikeCount > 0 || notifications.unreadCommentCount > 0) {
                    scaleAnimation(1)
                    dispatch(setOnNotificationPopup())
                }
                initial = true
            }
        }, 1600)
        return () => {
            clearTimeout(time)
        }
    }, [notifications.unreadPostLikeCount, notifications.unreadCommentCount])

    useEffect(() => {
        if (notifications.notificationPopup) {
            scaleAnimation(1)
            const time = setTimeout(() => {
                scaleAnimation(0)
                dispatch(setOffNotificationPopup())
            }, 5000)
            return () => {
                clearTimeout(time)
            }
        }
    }, [notifications.notificationPopup])

    return <Animated.View
        style={[
            {
                position: "absolute",
                zIndex: 2,
                top: 50,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "hsl(0 84.2% 60.2%)",
            },
            {
                transform: [{ scale: scaleValue }],
            },
        ]}>
        <View style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            backgroundColor: "hsl(0 84.2% 60.2%)",
            transform: [{ rotate: "45deg" }],
            position: "absolute",
            top: -6,
        }} />
        <View style={{
            backgroundColor: "hsl(0 84.2% 60.2%)",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            padding: 5,
            paddingHorizontal: 8,
            borderRadius: 10,
            gap: 5,
        }}>
            {notifications.unreadPostLikeCount > 0 ? <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}>
                <Heart fill={"hsl(0 0% 98%)"} size={24} color={"hsl(0 0% 98%)"} />
                <Text variant="heading3" style={{
                    color: "hsl(0 0% 98%)",
                }}>
                    {notifications.unreadPostLikeCount}
                </Text>
            </View> : <></>}
            {notifications.unreadCommentCount > 0 ? <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}>
                <MessageCircle fill={"hsl(0 0% 98%)"} size={24} color={"hsl(0 0% 98%)"} />
                <Text variant="heading3" style={{
                    color: "hsl(0 0% 98%)",
                }}>
                    {notifications.unreadCommentCount}
                </Text>
            </View> : <></>}
        </View>
    </Animated.View>
}