import { View, Text as RNText, TouchableOpacity } from "react-native"
import { Icon, Separator, Text, AnimatedView } from '@/components/skysolo-ui';
import { NavigationProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";


const HomeHeader = ({ navigation, translateY }: {
    navigation: NavigationProps,
    translateY: any
}) => {
    const unreadChatCount = useSelector((state: RootState) => state.NotificationState.unreadChatCount)
    const idCommentNotification = useSelector((state: RootState) => state.NotificationState.commentNotification.isNotification)


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
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate("notification")
                    }} >
                    <View style={{
                        position: "absolute",
                        right: 0,
                        top: 1,
                        backgroundColor: idCommentNotification ? "red" : "transparent",
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
        <Separator />
    </AnimatedView>
}

export default HomeHeader