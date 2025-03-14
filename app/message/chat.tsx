import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Navbar, Input } from "@/components/message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { NotFound } from "../NotFound";
import { FlatList, View } from "react-native";
import { Message } from "@/types";
import MessageItem from "@/components/message/messageItem";
import { Loader } from "hyper-native-ui";
import { conversationSeenAllMessage, fetchConversationAllMessagesApi, fetchConversationApi } from "@/redux-stores/slice/conversation/api.service";
import useDebounce, { useThrottle } from "@/lib/debouncing";

type Props = StaticScreenProps<{
    id: string;
}>;

const ChatScreen = memo(function ChatScreen({ route }: Props) {
    const id = route.params.id;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const session = useSelector((Root: RootState) => Root.AuthState.session.user);
    const conversation = useSelector((Root: RootState) => Root.ConversationState.conversationList?.find((item) => item?.id === id), ((pre, next) => pre === next));
    const cMembers = conversation?.members?.map((m) => m).length;
    const totalFetchedItemCount = conversation?.messages?.length || 0;
    const [loading, setLoading] = useState(false);
    const [loadingC, setLoadingC] = useState(true);

    const loadMoreMessages = useCallback(async (offset: number) => {
        if (!conversation?.id || loading) return;
        setLoading(true)
        try {
            await dispatch(fetchConversationAllMessagesApi({
                id: conversation?.id,
                offset: offset,
                limit: 20
            }) as any)
        } finally {
            setLoading(false)
        }
    }, [conversation?.id, loading])

    const navigateToImagePreview = useCallback((data: Message, index?: number) => {
        navigation.navigate("MessageImagePreview" as any, { data, index });
    }, []);

    const seenAllMessage = useDebounce(async () => {
        if (!conversation?.id || !session?.id) return;
        await dispatch(conversationSeenAllMessage({
            conversationId: conversation?.id,
            authorId: session?.id,
            members: conversation?.members?.filter((member) => member !== session?.id),
        }) as any);
    }, 1000);

    const fetchInitialMessage = useCallback(async () => {
        if (!conversation?.id) return;
        await dispatch(fetchConversationAllMessagesApi({
            id: conversation?.id,
            offset: 0,
            limit: 20
        }) as any)
    }, [conversation?.id])

    const fetchInitial = useCallback(async () => {
        if (!conversation?.id) {
            setLoadingC(true)
            await dispatch(fetchConversationApi(id) as any)
            setLoadingC(false)
        } else {
            setLoadingC(false)
        }
    }, [conversation?.id])

    useEffect(() => {
        fetchInitialMessage()
        fetchInitial()
    }, [conversation?.id])

    useEffect(() => {
        if (conversation?.id) {
            seenAllMessage()
        }
    }, [conversation?.id, conversation?.messages?.length])

    const onEndReached = useThrottle(() => {
        if (conversation) {
            loadMoreMessages(totalFetchedItemCount)
        }
    }, 1000)

    if (!conversation && !loadingC) return <NotFound />;
    if (!conversation) return <></>

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={conversation} />
            <FlatList
                inverted
                data={conversation.messages}
                windowSize={16}
                bounces={false}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                onEndReachedThreshold={0.5}
                refreshing={false}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                renderItem={({ item }) => <MessageItem
                    navigateToImagePreview={navigateToImagePreview}
                    data={item} seenMessage={cMembers === item.seenBy?.length}
                    key={item.id} myself={session?.id === item.authorId} />}
                ListFooterComponent={() => {
                    if (loading) {
                        return <Loader size={50} />
                    }
                    return <View />;
                }}
            />
            <Input conversation={conversation} />
        </View>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default ChatScreen;