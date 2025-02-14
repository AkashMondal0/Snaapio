import { Avatar, Icon } from "@/components/skysolo-ui";
import { Text } from "hyper-native-ui";
import { memo, useCallback } from "react";
import { Conversation } from "@/types";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { useTheme } from 'hyper-native-ui';
import { useNavigation } from "@react-navigation/native";
import { sendCallingRequestApi } from "@/redux-stores/slice/call/api.service";



const ChatScreenNavbar = memo(function ChatScreenNavbar({
    conversation,
}: {
    conversation: Conversation,
}) {
    const navigation = useNavigation();
    const { currentTheme } = useTheme();
    const dispatch = useDispatch();
    const currentTyping = useSelector((Root: RootState) => Root.ConversationState.currentTyping);
    const session = useSelector((Root: RootState) => Root.AuthState.session.user);


    const PressBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation?.goBack()
        } else {
            navigation.navigate("MessageList")
        }
    }, []);

    const onPress = useCallback(async () => {
        if (!conversation?.user) return ToastAndroid.show('user id not found', ToastAndroid.SHORT);
        await dispatch(sendCallingRequestApi({
            requestUserId: conversation.user?.id,
            requestUserData: conversation.user,
            micOn: false,
            videoOn: false,
            type: "audio-call"
        }) as any)
        navigation.navigate("Calling");
    }, [])

    return (
        <View style={{
            width: "100%",
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 6,
            paddingHorizontal: 3,
            borderBottomWidth: 1,
            borderColor: currentTheme?.border,
        }}>
            <View style={{
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
            }}>
                <Icon iconName={"ArrowLeft"} size={30} onPress={PressBack} />
                <View style={{
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}>
                    <Avatar
                        size={46}
                        url={conversation.user?.profilePicture} />
                    <View>
                        <Text
                            style={{ fontWeight: "600" }}
                            variant="body1">
                            {conversation?.user?.name}
                        </Text>
                        <Text
                            variantColor="secondary"
                            style={{ fontWeight: "400" }}
                            variant="body2">
                            {currentTyping?.conversationId === conversation.id && currentTyping.typing ? "typing..." : "status"}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ paddingRight: 10 }}>
                <Icon iconName="Phone" isButton variant="secondary" size={30} style={{ elevation: 2 }} onPress={onPress} />
            </View>
        </View>
    )
})
export default ChatScreenNavbar;