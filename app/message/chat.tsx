import { memo } from "react";
import { Navbar, Input, MessageList } from "@/components/message";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StaticScreenProps } from "@react-navigation/native";
import { NotFound } from "../NotFound";
import { View } from "react-native";

type Props = StaticScreenProps<{
    id: string;
}>;

const ChatScreen = memo(function ChatScreen({ route }: Props) {
    const id = route.params.id;
    const conversation = useSelector((Root: RootState) => Root.ConversationState.conversationList.find((item) => item.id === id), ((pre, next) => pre === next));


    // if (loading === "pending" || loading === "idle") {
    //     return <View style={{
    //         flex: 1,
    //         justifyContent: "center",
    //         alignItems: "center"
    //     }}>
    //         <Loader size={40} />
    //     </View>
    // }

    // if (loading === "normal" && error || !ConversationData || error) {
    //     if (!ConversationData && error) return <NotFound />
    //     return <View />
    // }

    if (!conversation) return <NotFound />;

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={conversation} />
            <MessageList conversation={conversation} />
            <Input conversation={conversation} />
        </View>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default ChatScreen;