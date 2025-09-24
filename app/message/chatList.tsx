import React, { useCallback, useMemo, useRef, memo, useState } from "react";
import { View, Vibration, FlatList, StyleSheet } from "react-native";
import { Conversation } from "@/types";
import { ActionSheet, Avatar } from "@/components/skysolo-ui";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import debounce from "@/lib/debouncing";
import searchText from "@/lib/TextSearch";
import ErrorScreen from "@/components/error/page";
import { ConversationDetailsSheet, ConversationItem, ListHeader } from "@/components/message";
import ListEmpty from "@/components/ListEmpty";
import { Loader } from "hyper-native-ui";
import { useNavigation } from "@react-navigation/native";
import { ConversationLoader } from "@/components/message/conversationItem";
import { fetchConversationsApi } from "@/redux-stores/slice/conversation/api.service";

const PAGE_LIMIT = 18;

const ChatListScreen = memo(function ChatListScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const list = useSelector((state: RootState) => state.ConversationState.conversationList);
    const listLoading = useSelector((state: RootState) => state.ConversationState.listLoading);
    const listError = useSelector((state: RootState) => state.ConversationState.listError);

    const [bottomSheetData, setBottomSheetData] = useState<Conversation | null>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "70%"], []);
    const [inputText, setInputText] = useState("");

    // Optimized list sorting/filtering
    const conversationList = useMemo(() => {
        return [...list]
            .filter((item) => item.lastMessageCreatedAt) // only active chats
            .sort(
                (a, b) =>
                    new Date(b.lastMessageCreatedAt ?? 0).getTime() -
                    new Date(a.lastMessageCreatedAt ?? 0).getTime()
            )
            .filter((item) => searchText(item?.user?.name ?? "", inputText));
    }, [list, inputText]);

    // ===== Event Handlers =====
    const handlePresentModalPress = useCallback((data: Conversation) => {
        setBottomSheetData(data);
        bottomSheetModalRef.current?.present();
        Vibration.vibrate([50]);
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) setBottomSheetData(null);
    }, []);

    // debounce is not a hook, so use it directly with useCallback
    const onChangeInput = useCallback(
        debounce((text: string) => setInputText(text), 400),
        []
    );

    const pushToPage = useCallback(
        (data: Conversation) => {
            navigation.navigate("MessageRoom" as never, { id: data.id } as any);
        },
        [navigation]
    );

    const loadMoreData = useCallback(() => {
        if (listLoading !== "pending" && list.length >= PAGE_LIMIT) {
            dispatch(
                fetchConversationsApi({
                    limit: PAGE_LIMIT,
                    offset: list.length,
                }) as any
            );
        }
    }, [dispatch, list.length, listLoading]);

    const onRefresh = useCallback(() => {
        dispatch(
            fetchConversationsApi({
                limit: PAGE_LIMIT,
                offset: 0,
            }) as any
        );
    }, [dispatch]);

    // ===== Render =====
    return (
        <View style={styles.container}>
            <FlatList
                data={conversationList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ConversationItem
                        data={item}
                        onClick={pushToPage}
                        onLongPress={handlePresentModalPress}
                    />
                )}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                initialNumToRender={12}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.4}
                windowSize={12}
                bounces={false}
                refreshing={listLoading === "pending"}
                onRefresh={onRefresh}
                ListHeaderComponent={
                    <ListHeader
                        pageToNewChat={() => navigation.navigate("FindMessage" as never)}
                        InputOnChange={onChangeInput}
                    />
                }
                ListEmptyComponent={
                    conversationList.length === 0 ? (
                        listError ? (
                            <ErrorScreen message={listError} />
                        ) : listLoading === "pending" || listLoading === "idle" ? (
                            <ConversationLoader size={12} />
                        ) : (
                            <ListEmpty text="No Messages" />
                        )
                    ) : null
                }
                ListFooterComponent={
                    listLoading === "pending" ? <Loader size={40} /> : null
                }
            />

            <ActionSheet
                bottomSheetModalRef={bottomSheetModalRef}
                snapPoints={snapPoints}
                handleSheetChanges={handleSheetChanges}
            >
                <ConversationDetailsSheet data={bottomSheetData} />
            </ActionSheet>

            <ActionButton onPress={() => navigation.navigate("AiMessage" as never)} />
        </View>
    );
});

export default ChatListScreen;

const ActionButton = memo(function ActionButton({ onPress }: { onPress: () => void }) {
    return (
        <View style={styles.actionButtonWrapper}>
            <Avatar
                serverImage={false}
                onPress={onPress}
                borderWidth={0}
                style={styles.avatar}
                TouchableOpacityOptions={{
                    activeOpacity: 0.6,
                    style: styles.avatarTouchable,
                }}
                url={require("../../assets/images/ai.png")}
                size={42}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    actionButtonWrapper: {
        position: "absolute",
        bottom: 20,
        right: 20,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 100,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 100,
    },
    avatar: {
        backgroundColor: "white",
        borderWidth: 0,
        borderColor: "white",
        borderRadius: 100,
    },
    avatarTouchable: {
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
    },
});
