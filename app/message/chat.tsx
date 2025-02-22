import { Loader } from "hyper-native-ui";
import { memo, useCallback, useEffect } from "react";
import { Navbar, Input, MessageList } from "@/components/message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StaticScreenProps } from "@react-navigation/native";
import { NotFound } from "../NotFound";
import { fetchConversationApi } from "@/redux-stores/slice/conversation/api.service";
import { View } from "react-native";
import { resetConversation } from "@/redux-stores/slice/conversation";

type Props = StaticScreenProps<{
    id: string;
}>;

const ChatScreen = memo(function ChatScreen({ route }: Props) {
    const id = route.params.id;
    const ConversationData = useSelector((Root: RootState) => Root.ConversationState.conversation, (prev, next) => prev?.id === next?.id)
    const loading = useSelector((Root: RootState) => Root.ConversationState.loading)
    const error = useSelector((Root: RootState) => Root.ConversationState.error)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        dispatch(resetConversation());
        dispatch(fetchConversationApi(id) as any)
    }, [id])

    useEffect(() => {
        fetchApi()
    }, [id])

    if (loading === "pending" || loading === "idle") return <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }}>
        <Loader size={40} />
    </View>

    if (loading === "normal" && error || !ConversationData || error) {
        if (!ConversationData && error) return <NotFound />
        return <View />
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={ConversationData} />
            <MessageList conversation={ConversationData} />
            <Input conversation={ConversationData} />
        </View>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default ChatScreen;