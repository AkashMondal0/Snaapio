import { Avatar, Icon } from "@/components/skysolo-ui";
import { Text } from "hyper-native-ui";
import { memo, useCallback } from "react";
import { Conversation } from "@/types";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { useTheme } from 'hyper-native-ui';
import { useNavigation } from "@react-navigation/native";



const ChatScreenNavbar = memo(function ChatScreenNavbar({
    conversation,
}: {
    conversation: Conversation,
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
                <Icon iconName={"Info"} isButton variant="secondary" size={26} style={{ elevation: 2 }} />
            </View>
        </View>
    )
})
export default ChatScreenNavbar;