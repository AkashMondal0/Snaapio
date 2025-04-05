import { memo, useCallback, } from "react";
import { View } from "react-native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import {
    Text
} from 'hyper-native-ui';
import AiChatScreenInput from "@/components/message/AiChatInput";
import AiMessageList from "@/components/message/AiMessageList";
import { useTheme } from 'hyper-native-ui';
import { useNavigation } from "@react-navigation/native";

const AskAiChatScreen = memo(function AskAiChatScreen() {
    const navigation = useNavigation()
    const PressBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation?.goBack()
        };
    }, []);

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AskAiChatScreenNavbar pressBack={PressBack} />
            <AiMessageList />
            <AiChatScreenInput />
        </View>
    )
})
export default AskAiChatScreen;

const AskAiChatScreenNavbar = memo(function AskAiChatScreenNavbar({
    pressBack,
    typing: currentTyping = false
}: {
    pressBack: () => void
    typing?: boolean
}) {
    const { currentTheme } = useTheme();

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
                    <View style={{
                        borderWidth: 0,
                        borderColor: currentTheme?.border,
                        borderRadius: 100,
                        backgroundColor: "white",
                        padding: 6
                    }}>
                        <Avatar
                            serverImage={false}
                            borderWidth={0}
                            style={{
                                backgroundColor: "white",
                                borderWidth: 0,
                                borderColor: "white",
                                borderRadius: 100,
                            }}
                            TouchableOpacityOptions={{
                                activeOpacity: 0.6,
                                style: {
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 2,
                                }
                            }}
                            url={require("../../assets/images/ai.png")}
                            size={30} />
                    </View>
                    <View>
                        <Text
                            style={{ fontWeight: "800" }}
                            variant="body1">
                            Gemini
                        </Text>
                        <Text
                            variantColor="secondary"
                            style={{ fontWeight: "400" }}
                            variant="body2">
                            {currentTyping ? "Typing..." : "Google AI"}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ paddingRight: 10 }}>
                <Icon iconName={"History"} isButton variant="secondary" size={26} style={{ elevation: 2 }} />
            </View>
        </View>
    )
})