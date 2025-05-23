import { memo, useCallback, useEffect, useState } from "react";
import { Navbar, Input } from "@/components/message";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StaticScreenProps, useFocusEffect, useNavigation } from "@react-navigation/native";
import { NotFound } from "../NotFound";
import { View, Dimensions, ImageBackground } from "react-native";
import { disPatchResponse, Message } from "@/types";
import MessageItem from "@/components/message/messageItem";
import { Loader, PressableView, Text } from "hyper-native-ui";
import { conversationSeenAllMessage, fetchConversationAllMessagesApi, fetchConversationApi } from "@/redux-stores/slice/conversation/api.service";
import useDebounce, { useThrottle } from "@/lib/debouncing";
import React from "react";
import { Avatar } from "@/components/skysolo-ui";
import {
    KeyboardGestureArea,
    useKeyboardHandler,
} from "react-native-keyboard-controller";
import Reanimated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
const { height: SH } = Dimensions.get("window")

const useKeyboardAnimation = () => {
    const progress = useSharedValue(0);
    const height = useSharedValue(0);

    useKeyboardHandler({
        onMove: (e) => {
            "worklet";

            // eslint-disable-next-line react-compiler/react-compiler
            progress.value = e.progress;
            height.value = e.height;
        },
        onInteractive: (e) => {
            "worklet";

            progress.value = e.progress;
            height.value = e.height;
        },
    });

    return { height, progress };
};
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
    let loaded = false;
    let stopFetch = false;

    // scroll
    const { height } = useKeyboardAnimation();
    const scrollViewStyle = useAnimatedStyle(
        () => ({
            transform: [{ translateY: -height.value }, { rotate: "180deg" }],
        }),
        [],
    );
    const textInputStyle = useAnimatedStyle(
        () => ({
            height: 60,
            width: "100%",
            backgroundColor: "transparent",
            transform: [{ translateY: -height.value }],
        }),
        [],
    );

    const loadMoreMessages = useCallback(async (offset: number) => {
        if (!conversation?.id || loading || stopFetch) return;
        setLoading(true)
        try {
            const res = await dispatch(fetchConversationAllMessagesApi({
                id: conversation?.id,
                offset: offset,
                limit: 20
            }) as any) as disPatchResponse<Message[]>
            if (res.payload.length <= 0) {
                stopFetch = true
            }
        } finally {
            setLoading(false)
        }
    }, [conversation?.id, loading]);

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
    }, [conversation?.id]);

    useFocusEffect(
        useCallback(() => {
            if (conversation?.id && !loaded) {
                fetchInitialMessage();
                fetchInitial();
                loaded = true;
            };

            return () => {

            };
        }, [conversation?.id])
    );

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
            <ImageBackground
                source={require('../../assets/chat_bg/bg7.jpeg')}
                resizeMode="cover"
                style={{
                    position: "absolute",
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    opacity:0.5
                }}>
            </ImageBackground>
            <Navbar conversation={conversation} />
            <KeyboardGestureArea
                showOnSwipeUp
                interpolator={"linear"}
                offset={50}
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                }}
            >
                <Reanimated.FlatList
                    inverted
                    data={conversation.messages}
                    windowSize={16}
                    style={[scrollViewStyle, {
                        transform: [{ rotate: "180deg" }],
                    }]}
                    bounces={false}
                    scrollEventThrottle={16}
                    removeClippedSubviews={true}
                    onEndReachedThreshold={0.5}
                    refreshing={false}
                    keyboardShouldPersistTaps='handled'
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    onEndReached={onEndReached}
                    renderItem={({ item }) => <MessageItem
                        navigateToImagePreview={navigateToImagePreview}
                        data={item} seenMessage={cMembers === item.seenBy?.length}
                        key={item.id} myself={session?.id === item.authorId} />}
                    ListFooterComponent={() => {
                        return <View style={{
                            height: SH, width: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }} >
                            <View style={{
                                display: 'flex',
                                alignItems: "center",
                                gap: 10,
                            }}>
                                <Avatar
                                    size={180}
                                    url={conversation.user?.profilePicture} />
                                <Text
                                    style={{ fontWeight: "600" }}
                                    variant="H5">
                                    {conversation?.user?.name}
                                </Text>
                                <Text
                                    style={{ fontWeight: "600" }}
                                    variant="body1">
                                    {conversation?.user?.email}
                                </Text>
                                <PressableView
                                    style={{
                                        width: "76%", padding: 10,
                                        justifyContent: "center", alignItems: "center"
                                    }}>
                                    <Text center variant="caption">
                                        Messages are end to end encrypted. only people in this chat can read.
                                    </Text>
                                </PressableView>
                            </View>
                            {loading ? <Loader size={50} /> : <></>}
                        </View>
                    }}
                />
            </KeyboardGestureArea>
            <Animated.View style={textInputStyle}>
                <Input conversation={conversation} />
            </Animated.View>

        </View>
    )
}, (prev, next) => prev.route.params.id === next.route.params.id)
export default ChatScreen;