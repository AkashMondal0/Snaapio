import { View, Text } from "@/components/skysolo-ui";
import { memo, useCallback, useEffect, useRef } from "react";
import { Navbar, Input, MessageList } from "@/components/message";
import debounce from "@/lib/debouncing";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { NavigationProp } from "@react-navigation/native";
import { ToastAndroid } from "react-native";
import { fetchConversationAllMessagesApi } from "@/redux-stores/slice/conversation/api.service";
import { disPatchResponse, Message } from "@/types";
let totalFetchedItemCount: number | null = 0

interface ChatScreenProps {
    navigation: NavigationProp<any>;
    route: {
        params: {
            id: string;
        },
        name: string;
    }
}

const ChatScreen = memo(function ChatScreen({ navigation, route }: ChatScreenProps) {
    const stopFetch = useRef(false)
    const stopBottomRef = useRef(true)
    const ConversationData = useSelector((Root: RootState) => Root.ConversationState.conversation, (prev, next) => prev?.id === next?.id)
    const Messages = useSelector((Root: RootState) => Root.ConversationState?.messages)
    const dispatch = useDispatch()

    const loadMoreMessages = useCallback(async (conversationId?: string) => {
        if (totalFetchedItemCount === null) return
        if (!conversationId) return ToastAndroid.show('Error loading messages', ToastAndroid.SHORT)
        try {
            const resM = await dispatch(fetchConversationAllMessagesApi({
                id: route.params.id,
                offset: totalFetchedItemCount,
                limit: 20
            }) as any) as disPatchResponse<Message[]>
            if (resM?.error) return ToastAndroid.show('Error loading messages', ToastAndroid.SHORT)
            if (resM.payload.length >= 20) {
                totalFetchedItemCount += 20
                // virtualizer.scrollToIndex(resM.payload.length + (virtualizer?.range?.endIndex ?? 0))
                return
            }
            // totalFetchedItemCount = null
        } finally {
            stopFetch.current = false
        }
    }, [route.params.id])

    const fetchMore = debounce(() => { loadMoreMessages(route.params.id) }, 1000)

    const PressBack = () => { navigation?.goBack() }

    useEffect(() => {
        console.log("fetch message", route.params.id)
        loadMoreMessages(route.params.id)
    }, [route.params.id])

    if (!ConversationData) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="heading3">No conversation found</Text>
    </View>


    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={ConversationData} pressBack={PressBack} />
            <MessageList messages={Messages} conversation={ConversationData} />
            <Input conversation={ConversationData} />
        </View>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default ChatScreen;