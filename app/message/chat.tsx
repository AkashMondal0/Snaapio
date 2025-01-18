import { ThemedView, Text } from "hyper-native-ui";
import { memo, useCallback, } from "react";
import { Navbar, Input, MessageList } from "@/components/message";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { View } from "react-native";
import { NavigationProps } from "@/types";

interface ChatScreenProps {
    navigation: NavigationProps
    route: {
        params: {
            id: string;
        },
        name: string;
    }
}

const ChatScreen = memo(function ChatScreen({ navigation, route }: ChatScreenProps) {
    const ConversationData = useSelector((Root: RootState) => Root.ConversationState.conversation, (prev, next) => prev?.id === next?.id)
    const PressBack = useCallback(() => { navigation?.goBack() }, [])

    if (!ConversationData) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="H4">No conversation found</Text>
    </View>

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={ConversationData} pressBack={PressBack} />
            <MessageList conversation={ConversationData} navigation={navigation} />
            <Input conversation={ConversationData} navigation={navigation} />
        </ThemedView>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default ChatScreen;