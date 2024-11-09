import { Avatar, Icon, Text, ThemedView } from "@/components/skysolo-ui";
import { memo, useCallback, } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { View } from "react-native";
import { NavigationProps } from "@/types";
import AiChatScreenInput from "@/components/message/AiChatInput";
import AiMessageList from "@/components/message/AiMessageList";

interface AskAiChatScreenProps {
    navigation: NavigationProps
    route: {
        params: {
            id: string;
        },
        name: string;
    }
}

const AskAiChatScreen = memo(function AskAiChatScreen({ navigation, route }: AskAiChatScreenProps) {
    // const ConversationData = useSelector((Root: RootState) => Root.ConversationState.conversation, (prev, next) => prev?.id === next?.id)
    const PressBack = useCallback(() => { navigation?.goBack() }, [])

    // if (!ConversationData) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //     <Text variant="heading3">No conversation found</Text>
    // </View>

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AskAiChatScreenNavbar pressBack={PressBack} />
            <AiMessageList navigation={navigation} />
            <AiChatScreenInput navigation={navigation} />
        </ThemedView>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default AskAiChatScreen;

const AskAiChatScreenNavbar = memo(function AskAiChatScreenNavbar({
    pressBack,
    typing: currentTyping = false
}: {
    pressBack: () => void
    typing?: boolean
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

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
                <Icon iconName={"ArrowLeft"} size={30} onPress={pressBack} />
                <View style={{
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}>
                    <Avatar
                        serverImage={false}
                        url={require("../../assets/images/ai.png")}
                        size={50}/>
                    <View>
                        <Text
                            style={{ fontWeight: "800" }}
                            variant="heading3">
                            Gemini
                        </Text>
                        <Text
                            colorVariant="secondary"
                            style={{ fontWeight: "400" }}
                            variant="heading4">
                            {currentTyping ? "Typing..." : "Google AI"}
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