
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
import useDebounce from "@/lib/debouncing";

const { height: SH } = Dimensions.get("window");

/* ======================== CONSTANTS ======================== */
const PAGINATION_LIMIT = 20;
const THROTTLE_DELAY = 1000;
const SCROLL_DELAY = 50;
const DEBOUNCE_SEEN_DELAY = 800;
const SCROLL_ANIMATION_DURATION = 300;

/* ================== KEYBOARD ANIMATION HOOK ================== */
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

/* ====================== TYPE DEFINITIONS ====================== */
type Props = StaticScreenProps<{ id: string }>;

interface ScrollState {
  isPending: boolean;
  timeoutId: NodeJS.Timeout | null;
}

/* ==================== HELPER FUNCTIONS ==================== */
const keyExtractor = (item: Message) => item.id;

const createMessageIdSet = (messages: Message[]): Set<string> => 
  new Set(messages.map(m => m.id));

const hasNewMessages = (
  currentMessages: Message[],
  previousIds: Set<string>
): boolean => {
  return currentMessages.some(msg => !previousIds.has(msg.id));
};

/* =================================================================== */
/*                            MAIN COMPONENT                           */
/* =================================================================== */
const ChatScreen = memo(function ChatScreen({ route }: Props) {
  const { id } = route.params;

  /* ---------------------- HOOKS & REFS ---------------------- */
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const listRef = useRef<Reanimated.FlatList<Message>>(null);
  
  // Scroll management
  const scrollStateRef = useRef<ScrollState>({
    isPending: false,
    timeoutId: null,
  });

  // Message tracking for smart auto-scroll
  const messageTrackingRef = useRef({
    count: 0,
    ids: new Set<string>(),
    isInitialLoad: true,
  });

  // Pagination control
  const paginationRef = useRef({
    isLoading: false,
    hasMore: true,
    lastCallTimestamp: 0,
  });

  // State refs to avoid stale closures
  const conversationRef = useRef<Conversation | undefined>();
  const sessionRef = useRef(useSelector((Root: RootState) => Root.AuthState.session.user));

  /* ---------------------- SELECTORS ---------------------- */
  const session = useSelector((Root: RootState) => Root.AuthState.session.user);
  
  const conversation = useSelector((Root: RootState) =>
    Root.ConversationState.conversationList?.find((item) => item?.id === id)
  );

  /* ---------------------- MEMOIZED VALUES ---------------------- */
  const cMembers = useMemo(
    () => conversation?.members?.length ?? 0,
    [conversation?.members]
  );

  const cMessages = useMemo(() => {
    const msgs = conversation?.messages ?? [];
    if (msgs.length === 0) return [];
    
    // Sort newest -> oldest for inverted FlatList
    return [...msgs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [conversation?.messages]);

  const totalFetchedItemCount = cMessages.length;

  /* ---------------------- LOCAL STATE ---------------------- */
  const [loading, setLoading] = useState(false);
  const [loadingC, setLoadingC] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  /* ---------------------- REF UPDATES ---------------------- */
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  /* ==================== SCROLL MANAGEMENT ==================== */
  const scrollToBottom = useCallback((animated = true) => {
    const scrollState = scrollStateRef.current;
    
    // Prevent concurrent scroll operations
    if (scrollState.isPending) return;
    
    scrollState.isPending = true;

    // Clear existing timeout
    if (scrollState.timeoutId) {
      clearTimeout(scrollState.timeoutId);
    }

    const performScroll = () => {
      try {
        const flatListRef: any = listRef.current;
        if (!flatListRef) {
          scrollState.isPending = false;
          return;
        }

        // Handle both direct ref and getNode() patterns
        if (typeof flatListRef.scrollToOffset === "function") {
          flatListRef.scrollToOffset({ offset: 0, animated });
        } else {
          const node = typeof flatListRef.getNode === "function" 
            ? flatListRef.getNode() 
            : flatListRef;
          
          if (node?.scrollToOffset) {
            node.scrollToOffset({ offset: 0, animated });
          }
        }
      } catch (error) {
        console.warn("Scroll error:", error);
      } finally {
        // Reset pending flag after animation completes
        scrollState.timeoutId = setTimeout(() => {
          scrollState.isPending = false;
          scrollState.timeoutId = null;
        }, animated ? SCROLL_ANIMATION_DURATION : 0);
      }
    };

    // Double RAF for reliable layout completion
    requestAnimationFrame(() => {
      requestAnimationFrame(performScroll);
    });
  }, []);

  /* ============== SMART NEW MESSAGE DETECTION ============== */
  useEffect(() => {
    const tracking = messageTrackingRef.current;
    const currentCount = cMessages.length;
    const previousCount = tracking.count;

    // Skip on initial load
    if (tracking.isInitialLoad && currentCount > 0) {
      tracking.count = currentCount;
      tracking.ids = createMessageIdSet(cMessages);
      tracking.isInitialLoad = false;
      return;
    }

    // No change in message count
    if (currentCount === previousCount) return;

    // Detect truly new messages (not from pagination)
    if (currentCount > previousCount) {
      const currentIds = createMessageIdSet(cMessages);
      
      // Check if new messages are at the top (newest) - actual new messages
      // In inverted list, newest messages are at index 0
      const newestMessages = cMessages.slice(0, currentCount - previousCount);
      const hasNewMessageAtTop = newestMessages.some(msg => !tracking.ids.has(msg.id));

      // Check if new messages are at the bottom (oldest) - pagination
      const oldestMessages = cMessages.slice(previousCount);
      const hasPaginatedMessages = oldestMessages.length > 0 && 
                                   oldestMessages.some(msg => !tracking.ids.has(msg.id));

      if (hasNewMessageAtTop && initialLoadComplete) {
        // Real new message - scroll to bottom
        setTimeout(() => scrollToBottom(true), SCROLL_DELAY);
      }
      // If hasPaginatedMessages is true, maintainVisibleContentPosition handles it

      // Update tracking
      tracking.ids = currentIds;
    } else if (currentCount < previousCount) {
      // Messages removed - update tracking
      tracking.ids = createMessageIdSet(cMessages);
    }

    tracking.count = currentCount;
  }, [cMessages, scrollToBottom, initialLoadComplete]);

  /* ==================== KEYBOARD ANIMATION ==================== */
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

  /* ==================== DATA FETCHING ==================== */
  const loadMoreMessages = useCallback(
    async (offset: number) => {
      const conv = conversationRef.current;
      const pagination = paginationRef.current;

      if (!conv?.id || pagination.isLoading || !pagination.hasMore) {
        return;
      }

      pagination.isLoading = true;
      setLoading(true);

      try {
        const res = (await dispatch(
          fetchConversationAllMessagesApi({
            id: conv.id,
            offset,
            limit: PAGINATION_LIMIT,
          }) as any
        )) as disPatchResponse<Message[]>;

        // Stop pagination if no more messages
        if (!res?.payload || res.payload.length === 0) {
          pagination.hasMore = false;
        }
      } catch (error) {
        console.error("Load more messages error:", error);
      } finally {
        pagination.isLoading = false;
        setLoading(false);
      }
    },
    [dispatch]
  );

  const fetchInitialMessages = useCallback(async () => {
    const conv = conversationRef.current;
    if (!conv?.id) return;

    try {
      await dispatch(
        fetchConversationAllMessagesApi({
          id: conv.id,
          offset: 0,
          limit: PAGINATION_LIMIT,
        }) as any
      );
      setInitialLoadComplete(true);
    } catch (error) {
      console.error("Fetch initial messages error:", error);
    }
  }, [dispatch]);

  const fetchConversation = useCallback(async () => {
    const conv = conversationRef.current;
    
    if (!conv?.id) {
      setLoadingC(true);
      try {
        await dispatch(fetchConversationApi(id) as any);
      } catch (error) {
        console.error("Fetch conversation error:", error);
      } finally {
        setLoadingC(false);
      }
    } else {
      setLoadingC(false);
    }
  }, [dispatch, id]);

  /* ==================== MARK AS SEEN ==================== */
  const debouncedSeenAll = useRef(
    useDebounce(async () => {
      const conv = conversationRef.current;
      const sess = sessionRef.current;
      
      if (!conv?.id || !sess?.id) return;

      try {
        await dispatch(
          conversationSeenAllMessage({
            conversationId: conv.id,
            authorId: sess.id,
            members: conv.members?.filter((m) => m !== sess.id) ?? [],
          }) as any
        );
      } catch (error) {
        console.error("Mark seen error:", error);
      }
    }, DEBOUNCE_SEEN_DELAY)
  ).current;

  useEffect(() => {
    if (conversation?.id && initialLoadComplete) {
      debouncedSeenAll();
    }
  }, [conversation?.id, conversation?.messages?.length, debouncedSeenAll, initialLoadComplete]);

  /* ==================== LIFECYCLE HOOKS ==================== */
  useFocusEffect(
    useCallback(() => {
      // Reset pagination state
      paginationRef.current.hasMore = true;
      paginationRef.current.isLoading = false;

      // Fetch conversation data
      fetchConversation();

      // Fetch initial messages if first time
      if (conversationRef.current?.id && !initialLoadComplete) {
        fetchInitialMessages();
      }

      return () => {
        // Cleanup scroll timeout on blur
        const scrollState = scrollStateRef.current;
        if (scrollState.timeoutId) {
          clearTimeout(scrollState.timeoutId);
          scrollState.timeoutId = null;
        }
      };
    }, [fetchConversation, fetchInitialMessages, initialLoadComplete])
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const scrollState = scrollStateRef.current;
      if (scrollState.timeoutId) {
        clearTimeout(scrollState.timeoutId);
      }
    };
  }, []);

  /* ==================== NAVIGATION ==================== */
  const navigateToImagePreview = useCallback(
    (data: Message, index?: number) => {
      navigation.navigate("MessageImagePreview" as never, { data, index } as any);
    },
    [navigation]
  );

  /* ==================== PAGINATION HANDLER ==================== */
  const onEndReached = useCallback(() => {
    const pagination = paginationRef.current;
    const now = Date.now();

    // Throttle pagination calls
    if (now - pagination.lastCallTimestamp < THROTTLE_DELAY) {
      return;
    }

    pagination.lastCallTimestamp = now;

    // Only paginate if we have enough messages
    if (conversationRef.current && totalFetchedItemCount >= PAGINATION_LIMIT) {
      loadMoreMessages(totalFetchedItemCount);
    }
  }, [loadMoreMessages, totalFetchedItemCount]);

  /* ==================== RENDER ITEM ==================== */
  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageItem
        data={item}
        myself={session?.id === item.authorId}
        seenMessage={(item.seenBy?.length ?? 0) >= cMembers && cMembers > 0}
        navigateToImagePreview={navigateToImagePreview}
      />
    ),
    [session?.id, cMembers, navigateToImagePreview]
  );

  /* ==================== EARLY EXITS ==================== */
  if (!conversation && !loadingC) return <NotFound />;
  if (!conversation) return null;

  /* ==================== MAIN RENDER ==================== */
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
          ref={listRef}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          windowSize={16}
          maxToRenderPerBatch={12}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={listTranslateStyle as any}
          maintainVisibleContentPosition={{ 
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10 
          }}
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
