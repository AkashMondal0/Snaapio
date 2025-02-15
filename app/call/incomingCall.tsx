import { memo, useCallback } from "react";
import { Text, useTheme } from "hyper-native-ui";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "@/components/skysolo-ui";
// import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StackActions, useNavigation } from "@react-navigation/native";
import { incomingCallAnswerApi } from "@/redux-stores/slice/call/api.service";

const InComingCall = memo(function InComingCall() {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const inComingCall = useSelector((state: RootState) => state.CallState.inComingCall);
    const userData = inComingCall?.userData

    const HP = useCallback(() => {
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }, []);

    const Message = useCallback(() => {
        HP();
    }, []);

    const Accept = useCallback(async () => {
        if (!userData) return
        HP();
        await dispatch(incomingCallAnswerApi({
            acceptCall: true,
            requestSenderUserId: userData?.id,
        }) as any)
        navigation.dispatch(StackActions.replace("Video", userData))
    }, [userData?.id]);

    const Decline = useCallback(async () => {
        if (!userData?.id) return
        HP();
        await dispatch(incomingCallAnswerApi({
            acceptCall: false,
            requestSenderUserId: userData?.id
        }) as any);
        if (navigation.canGoBack()) {
            navigation.goBack()
            return
        }
        navigation.dispatch(StackActions.replace("HomeTabs"))
    }, [userData?.id]);


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