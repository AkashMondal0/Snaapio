import { memo, useCallback, useEffect } from "react";
import { Navbar, Input } from "@/components/message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { NotFound } from "../NotFound";
import { FlatList, View } from "react-native";
import { useGQArray } from "@/lib/useGraphqlQuery";
import { Message } from "@/types";
import { CQ } from "@/redux-stores/slice/conversation/conversation.queries";
import MessageItem from "@/components/message/messageItem";
import { Loader } from "hyper-native-ui";
import { setMessages } from "@/redux-stores/slice/conversation";
import { conversationSeenAllMessage, fetchConversationApi } from "@/redux-stores/slice/conversation/api.service";
import useDebounce from "@/lib/debouncing";

type Props = StaticScreenProps<{
    id: string;
}>;

const ChatScreen = memo(function ChatScreen({ route }: Props) {
    const id = route.params.id;
    // console.log(id)
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const session = useSelector((Root: RootState) => Root.AuthState.session.user);
    const conversation = useSelector((Root: RootState) => Root.ConversationState.conversationList?.find((item) => item?.id === id), ((pre, next) => pre === next));
    const cMembers = conversation?.members?.map((m) => m).length;

    const { error, loadMoreData, loading, fetch } = useGQArray<Message>({
        query: CQ.findAllMessages,
        order: "reverse",
        variables: {
            limit: 16,
            offset: conversation?.messages.length,
            id: conversation?.id
        },
        initialFetch: false,
        onDataChange(data) {
            dispatch(setMessages(data as any))
        },
    });

    const navigateToImagePreview = useCallback((data: Message) => {
        navigation.navigate("MessageImagePreview" as any, { data });
    }, []);

    const seenAllMessage = useDebounce(() => {
        if (!conversation?.id || !session?.id) return;
        dispatch(conversationSeenAllMessage({
            conversationId: conversation?.id,
            authorId: session?.id,
            members: conversation?.members?.filter((member) => member !== session?.id),
        }) as any);
    }, 1000);

    useEffect(() => {
        if (conversation?.messages?.length === 0 && conversation?.id) {
            fetch()
        }
        if (conversation?.id) {
            seenAllMessage()
        } else {
            dispatch(fetchConversationApi(id) as any)
        }
    }, [conversation?.id])


    if (!conversation) return <NotFound />;

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
                onEndReached={loadMoreData}
                renderItem={({ item }) => <MessageItem
                    navigateToImagePreview={navigateToImagePreview}
                    data={item} seenMessage={cMembers === item.seenBy?.length}
                    key={item.id} myself={session?.id === item.authorId} />}
                ListEmptyComponent={() => {
                    // if (error && loading === "normal") {
                    //     return <ErrorScreen message={error} />;
                    // }
                    // if (conversation.messages.length <= 0 && loading === "normal") {
                    //     return <ListEmpty text="No Message" />;
                    // }
                    return <View />
                }}
                ListFooterComponent={() => {
                    if (loading !== "normal") {
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