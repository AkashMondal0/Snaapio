import { ThemedView, Text } from "hyper-native-ui";
import { memo, } from "react";
import { Navbar, Input, MessageList } from "@/components/message";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { View } from "react-native";
import { StaticScreenProps } from "@react-navigation/native";

type Props = StaticScreenProps<{
    id: string;
}>;

const ChatScreen = memo(function ChatScreen({ route }: Props) {
    const ConversationData = useSelector((Root: RootState) => Root.ConversationState.conversation, (prev, next) => prev?.id === next?.id)

    if (!ConversationData) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="H4">No conversation found</Text>
    </View>

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={ConversationData} />
            <MessageList conversation={ConversationData} />
            <Input conversation={ConversationData}/>
        </ThemedView>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default ChatScreen;