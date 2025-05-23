import { Avatar, Icon } from "@/components/skysolo-ui";
import { PressableButton, Text } from "hyper-native-ui";
import { memo, useCallback } from "react";
import { Conversation } from "@/types";
import { StatusBar, ToastAndroid, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { useTheme } from 'hyper-native-ui';
import { useNavigation } from "@react-navigation/native";



const ChatScreenNavbar = memo(function ChatScreenNavbar({
    conversation,
}: {
    conversation: Conversation | null,
}) {
    const navigation = useNavigation();
    const { currentTheme } = useTheme();
    const currentTyping = useSelector((Root: RootState) => Root.ConversationState.currentTyping);

    const PressBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation?.goBack()
        } else {
            navigation.navigate("MessageList")
        }
    }, []);

    const onPress = useCallback(async (isVideo: boolean) => {
        if (!conversation?.user) return ToastAndroid.show('user id not found', ToastAndroid.SHORT);
        navigation.navigate("Video", {
            email: conversation.user.email,
            profilePicture: conversation.user.profilePicture,
            username: conversation.user.username,
            name: conversation.user.name,
            id: conversation.user.id,
            stream: isVideo ? "video" : "audio",
            userType: "LOCAL"
        } as any);
    }, [])


    if (!conversation) return <></>

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
            paddingTop: StatusBar.currentHeight,
            backgroundColor:currentTheme.background,
            zIndex:100
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
            <View style={{ paddingRight: 16, gap: 12, display: "flex", flexDirection: "row" }}>
                <PressableButton
                    style={{ padding: 10, borderRadius: 100 }}
                    radius={100} onPress={() => onPress(false)}>
                    <Icon
                        onPress={() => onPress(false)}
                        iconName={'Phone'}
                        size={24} />
                </PressableButton>
                <PressableButton
                    style={{ padding: 10, borderRadius: 100 }}
                    radius={100} onPress={() => onPress(false)}>
                    <Icon
                        onPress={() => onPress(true)}
                        iconName={'Video'}
                        size={24} />
                </PressableButton>
            </View>
        </View>
    )
})
export default ChatScreenNavbar;