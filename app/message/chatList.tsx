import React, {
  useCallback,
  useMemo,
  useRef,
  memo,
  useState,
  lazy,
  Suspense,
  useEffect,
} from "react";
import {
  View,
  Vibration,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

import { Conversation } from "@/types";
import { RootState } from "@/redux-stores/store";
import { fetchConversationsApi } from "@/redux-stores/slice/conversation/api.service";

import debounce from "@/lib/debouncing";
import searchText from "@/lib/TextSearch";
import { ActionSheet } from "@/components/skysolo-ui";
import { Loader } from "hyper-native-ui";

// 💤 Lazy-load only secondary / heavy components
const ErrorScreen = lazy(() => import("@/components/error/page"));
const ActionButton = lazy(() => import("@/components/message/ActionButton"));
const ConversationLoader = lazy(() => import("@/components/message/ConversationLoader"));
const ListEmpty = lazy(() => import("@/components/ListEmpty"));
const ConversationDetailsSheet = lazy(() => import("@/components/message/conversationDetailsSheet"));

// 🚫 Keep always-visible components direct imports
import ListHeader from "@/components/message/listHeader";
import ConversationItem from "@/components/message/conversationItem";

const PAGE_LIMIT = 18;

const ChatListScreen = memo(function ChatListScreen() {
  // ===== Hooks =====
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { list, listLoading, listError } = useSelector(
    (state: RootState) => ({
      list: state.ConversationState.conversationList,
      listLoading: state.ConversationState.listLoading,
      listError: state.ConversationState.listError,
    }),
    shallowEqual
  );

  const [bottomSheetData, setBottomSheetData] = useState<Conversation | null>(
    null
  );
  const [inputText, setInputText] = useState("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // ===== Stable values =====
  const snapPoints = useMemo(() => ["50%", "70%"], []);

  // ✅ Stable debounce
  const debouncedSetInput = useRef(
    debounce((text: string) => setInputText(text), 400)
  ).current;

  // ✅ Filter + sort conversations
  const conversationList = useMemo(() => {
    return list
      .filter((item) => item.lastMessageCreatedAt)
      .sort(
        (a, b) =>
          new Date(b.lastMessageCreatedAt ?? 0).getTime() -
          new Date(a.lastMessageCreatedAt ?? 0).getTime()
      )
      .filter((item) => searchText(item?.user?.name ?? "", inputText));
  }, [list, inputText]);

  // ===== Handlers =====
  const handlePresentModalPress = useCallback((data: Conversation) => {
    setBottomSheetData(data);
    bottomSheetModalRef.current?.present();
    Vibration.vibrate(50);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setBottomSheetData(null);
  }, []);

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

  // ===== Preload heavy components in background =====
  useEffect(() => {
    import("@/components/message/conversationDetailsSheet");
    import("@/components/message/ActionButton");
  }, []);

  // ===== Render item (memoized) =====
  const renderItem: ListRenderItem<Conversation> = useCallback(
    ({ item }) => (
      <ConversationItem
        data={item}
        onClick={pushToPage}
        onLongPress={handlePresentModalPress}
      />
    ),
    [pushToPage, handlePresentModalPress]
  );

  // ===== Render =====
  return (
    <View style={styles.container}>
      <Suspense fallback={<Loader size={40} />}>
        <FlatList
          data={conversationList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          updateCellsBatchingPeriod={50}
          windowSize={15}
          removeClippedSubviews
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.4}
          refreshing={listLoading === "pending"}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <ListHeader
              pageToNewChat={() =>
                navigation.navigate("FindMessage" as never)
              }
              InputOnChange={debouncedSetInput}
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
      </Suspense>

      <ActionSheet
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleSheetChanges={handleSheetChanges}
      >
        <Suspense fallback={<Loader size={30} />}>
          <ConversationDetailsSheet data={bottomSheetData} />
        </Suspense>
      </ActionSheet>

      <Suspense fallback={<Loader size={40} />}>
        <ActionButton
          onPress={() => navigation.navigate("AiMessage" as never)}
        />
      </Suspense>
    </View>
  );
});

export default ChatListScreen;

// ===== Styles =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
