import { memo, useCallback, useContext, useEffect } from "react";
import { Text, useTheme } from "hyper-native-ui";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StackActions, useNavigation } from "@react-navigation/native";
import { hapticVibrate } from "@/lib/RN-vibration";
import { Session } from "@supabase/supabase-js";
import { SocketContext } from "@/provider/SocketConnections";
import { useCameraPermissions } from "expo-camera";

const InComingCall = memo(function InComingCall({
    route
}: {
    route: { params: Session["user"] }
}) {
    const [permission, requestPermission] = useCameraPermissions();
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const { socket } = useContext(SocketContext);
    const callStatus = useSelector((state: RootState) => state.CallState.callStatus);
    const session = useSelector((state: RootState) => state.AuthState.session.user);
    const userData = route.params as any

    const Message = useCallback(() => {
        hapticVibrate()
    }, []);

    const getMediaPermission = useCallback(async () => {
        if (!permission) return
        const rePermission = await requestPermission();
        if (!rePermission.granted) {
            return;
        }
        return rePermission;
    }, [permission]);

    const Accept = useCallback(async () => {
        if (!userData) return
        hapticVibrate()
        navigation.dispatch(StackActions.replace("Video", {
            ...userData,
            isVideo: true,
            userType: "REMOTE"
        }))
    }, [userData?.id]);

    const Decline = useCallback(async () => {
        if (!userData?.id) return
        hapticVibrate()
        socket?.emit("answer-call", {
            ...session,
            status: "calling",
            stream: "video",
            call: "DECLINE",
            remoteId: userData?.id
        })
        if (navigation.canGoBack()) {
            navigation.goBack()
            return
        }
        navigation.dispatch(StackActions.replace("HomeTabs"))
    }, [userData?.id]);

    useEffect(() => {
        if (callStatus === "DISCONNECTED") {
            if (navigation.canGoBack()) {
                navigation.goBack()
            }
        }
    }, [callStatus])

    return (
        <View style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
        }}>
            {/* top */}
            <View style={{
                display: "flex",
                flexDirection: "row",
                height: 100,
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16
            }}>
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1
                }}>
                    <Text variant="H4" bold="bold">{userData?.name}</Text>
                    <Text variant="body1" variantColor="secondary">{userData?.email}</Text>
                </View>
            </View>
            {/* center */}
            <View>
                <Avatar
                    size={220}
                    url={userData?.profilePicture}
                    style={{
                        aspectRatio: 1 / 1,
                        borderRadius: 500,
                        marginBottom: 30,
                    }}
                />
            </View>
            {/* end */}
            <View style={{
                width: "100%",
                borderRadius: 30,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                paddingHorizontal: "6%",
            }}>
                <View>
                    <TouchableOpacity onPress={Decline}
                        activeOpacity={0.6}
                        style={{
                            aspectRatio: 1 / 1,
                            width: 60,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: currentTheme.destructive,
                            marginBottom: 2,
                            transform: [{ rotate: "133deg" }]
                        }}>
                        <Icon iconName="Phone" size={24} onPress={Decline} color="#fff" />
                    </TouchableOpacity>
                    <Text variant="body1" center variantColor="secondary">Decline</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={Accept}
                        activeOpacity={0.6}
                        style={{
                            aspectRatio: 1 / 1,
                            width: 60,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: "hsl(142.1 76.2% 36.3%)",
                            marginBottom: 2
                        }}>
                        <Icon iconName="Phone" size={24} color={"#fff"} onPress={Accept} />
                    </TouchableOpacity>
                    <Text variant="body1" center variantColor="secondary">Accept</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={Message}
                        activeOpacity={0.6}
                        style={{
                            aspectRatio: 1 / 1,
                            width: 60,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: currentTheme.muted,
                            marginBottom: 2
                        }}>
                        <Icon iconName="MessageSquareText" size={24} onPress={Message} />
                    </TouchableOpacity>
                    <Text variant="body1" center variantColor="secondary">Message</Text>
                </View>
            </View>
        </View>
    )
})
export default InComingCall;