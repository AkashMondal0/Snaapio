import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  useFocusEffect,
  useNavigation,
  StaticScreenProps,
} from "@react-navigation/native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  KeyboardGestureArea,
  KeyboardStickyView,
  useKeyboardHandler,
} from "react-native-keyboard-controller";

import { Navbar, Input } from "@/components/message";
import MessageItem from "@/components/message/messageItem";
import { Loader, PressableView, Text } from "hyper-native-ui";
import { Avatar } from "@/components/skysolo-ui";
import { NotFound } from "../NotFound";

import { RootState } from "@/redux-stores/store";
import {
  conversationSeenAllMessage,
  fetchConversationAllMessagesApi,
  fetchConversationApi,
} from "@/redux-stores/slice/conversation/api.service";

import { Conversation, Message, disPatchResponse } from "@/types";

const { height: SH } = Dimensions.get("window");

/* -------------------- small, safe utilities (no hooks) -------------------- */
function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

/* -------------------- keyboard animation hook -------------------- */
const useKeyboardAnimation = () => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);

  useKeyboardHandler({
    onMove: (e) => {
      "worklet";
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

/* ------------------------------ types ------------------------------ */
type Props = StaticScreenProps<{ id: string }>;

/* =================================================================== */
/*                            MAIN COMPONENT                           */
/* =================================================================== */
const ChatScreen = memo(function ChatScreen({ route }: Props) {
  const id = route.params.id;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const session = useSelector(
    (Root: RootState) => Root.AuthState.session.user
  );

  const conversation = useSelector((Root: RootState) =>
    Root.ConversationState.conversationList?.find((item) => item?.id === id)
  );

  const cMembers = useMemo(
    () => conversation?.members?.length ?? 0,
    [conversation?.members]
  );

  const totalFetchedItemCount = conversation?.messages?.length || 0;

  const cMessages = useMemo(() => {
    const msgs = conversation?.messages ?? [];
    if (msgs.length <= 0) return [];
    // sort newest -> oldest for an inverted FlatList
    return [...msgs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [conversation?.messages]);

  const [loading, setLoading] = useState(false);
  const [loadingC, setLoadingC] = useState(true);

  // Persisted flags across renders
  const initialLoadedRef = useRef(false);
  const stopFetchRef = useRef(false);
  const lastPageCallTsRef = useRef(0);

  // Keep latest values in refs for non-stale async callbacks
  const conversationRef = useRef(conversation);
  const sessionRef = useRef(session);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  /* -------------------------- keyboard shift -------------------------- */
  const { height } = useKeyboardAnimation();
  const listTranslateStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateY: -height.value },
        { rotate: "180deg" }
      ]
    }),
    []
  );

  /* --------------------------- data fetching --------------------------- */
  const loadMoreMessages = useCallback(
    async (offset: number) => {
      const conv = conversationRef.current;
      if (!conv?.id) return;
      if (loading || stopFetchRef.current) return;

      setLoading(true);
      try {
        const res = (await dispatch(
          fetchConversationAllMessagesApi({
            id: conv.id,
            offset,
            limit: 20,
          }) as any
        )) as disPatchResponse<Message[]>;

        if (!res || !res.payload || res.payload.length <= 0) {
          stopFetchRef.current = true;
        }
      } finally {
        setLoading(false);
      }
    },
    [dispatch, loading]
  );

  const fetchInitialMessage = useCallback(async () => {
    const conv = conversationRef.current;
    if (!conv?.id) return;
    await dispatch(
      fetchConversationAllMessagesApi({
        id: conv.id,
        offset: 0,
        limit: 20,
      }) as any
    );
  }, [dispatch]);

  const fetchInitial = useCallback(async () => {
    const conv = conversationRef.current;
    if (!conv?.id) {
      setLoadingC(true);
      await dispatch(fetchConversationApi(id) as any);
      setLoadingC(false);
    } else {
      setLoadingC(false);
    }
  }, [dispatch, id]);

  // Debounced "seen all" using refs to avoid stale closures
  const debouncedSeenAll = useRef(
    debounce(async () => {
      const conv = conversationRef.current;
      const sess = sessionRef.current;
      if (!conv?.id || !sess?.id) return;
      await dispatch(
        conversationSeenAllMessage({
          conversationId: conv.id,
          authorId: sess.id,
          members: conv.members?.filter((m) => m !== sess.id),
        }) as any
      );
    }, 800)
  ).current;

  useFocusEffect(
    useCallback(() => {
      // New focus → ensure base data
      stopFetchRef.current = false;

      // (Re)fetch conversation if needed
      fetchInitial();

      // First-time messages fetch on this screen
      if (conversationRef.current?.id && !initialLoadedRef.current) {
        fetchInitialMessage();
        initialLoadedRef.current = true;
      }

      return () => {
        // no-op cleanup
      };
    }, [fetchInitial, fetchInitialMessage])
  );

  // mark messages as seen whenever conversation or message count changes
  useEffect(() => {
    if (conversation?.id) debouncedSeenAll();
  }, [conversation?.id, conversation?.messages?.length, debouncedSeenAll]);

  /* ---------------------------- navigation ---------------------------- */
  const navigateToImagePreview = useCallback(
    (data: Message, index?: number) => {
      navigation.navigate("MessageImagePreview" as never, { data, index } as any);
    },
    [navigation]
  );

  /* -------------------------- pagination throttle -------------------------- */
  const onEndReached = useCallback(() => {
    // simple 1s throttle to avoid burst fetches
    const now = Date.now();
    if (now - lastPageCallTsRef.current < 1000) return;
    lastPageCallTsRef.current = now;

    if (conversationRef.current && cMessages.length > 19) {
      loadMoreMessages(totalFetchedItemCount);
    }
  }, [cMessages.length, loadMoreMessages, totalFetchedItemCount]);

  /* ------------------------------ early exits ------------------------------ */
  if (!conversation && !loadingC) return <NotFound />;
  if (!conversation) return <></>;

  /* -------------------------------- render -------------------------------- */
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/chat_bg/bg7.jpeg")}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      />

      <Navbar conversation={conversation} />

      <KeyboardGestureArea
        showOnSwipeUp
        interpolator="linear"
        offset={50}
        style={styles.gestureArea}
      >
        <Reanimated.FlatList
          inverted
          data={cMessages}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <MessageItem
              data={item}
              myself={session?.id === item.authorId}
              seenMessage={(item.seenBy?.length ?? 0) >= cMembers && cMembers > 0}
              navigateToImagePreview={navigateToImagePreview}
            />
          )}
          windowSize={16}
          maxToRenderPerBatch={12}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={listTranslateStyle as any}
          maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          ListFooterComponent={
            <Footer
              conversation={conversation}
              hasMessages={cMessages.length > 0}
              loading={loading}
            />
          }
        />
      </KeyboardGestureArea>

      <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
        <Input conversation={conversation} />
      </KeyboardStickyView>
    </View>
  );
},
(prev, next) => prev.route.params.id === next.route.params.id);

export default ChatScreen;

/* ============================== Subcomponents ============================== */

const Footer = memo(function Footer({
  conversation,
  hasMessages,
  loading,
}: {
  conversation: Conversation;
  hasMessages: boolean;
  loading: boolean;
}) {
  return (
    <>
      <HeroComponent conversation={conversation} />
      {!hasMessages ? (
        <Text center variant="caption" style={styles.noMoreText}>
          No more messages
        </Text>
      ) : null}
      {loading ? <Loader size={50} /> : null}
    </>
  );
});

const HeroComponent = memo(
  function HeroComponent({ conversation }: { conversation: Conversation }) {
    return (
      <View style={styles.heroContainer}>
        <View style={styles.heroInner}>
          <Avatar size={180} url={conversation.user?.profilePicture} />
          <Text style={styles.heroName} variant="H5">
            {conversation?.user?.name}
          </Text>
          <Text style={styles.heroEmail} variant="body1">
            {conversation?.user?.email}
          </Text>
          <PressableView style={styles.heroPressable}>
            <Text center variant="caption">
              Messages are end-to-end encrypted. Only people in this chat can read.
            </Text>
          </PressableView>
        </View>
      </View>
    );
  },
  (prev, next) => prev.conversation.id === next.conversation.id
);

/* =============================== helpers =============================== */

const keyExtractor = (item: Message) => item.id;

/* ================================ styles ================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  bgImage: { opacity: 0.5 },
  gestureArea: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  listContent: {
    paddingBottom: 60,
    paddingTop: 10,
    flexGrow: 1,
  },
  noMoreText: { marginVertical: 10 },
  heroContainer: {
    height: SH,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heroInner: {
    alignItems: "center",
    gap: 10,
  },
  heroName: { fontWeight: "600" },
  heroEmail: { fontWeight: "600" },
  heroPressable: {
    width: "76%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
