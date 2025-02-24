/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useRef, memo, useState, useEffect } from 'react';
import { View, Vibration, FlatList } from 'react-native';
import { Conversation, disPatchResponse } from '@/types';
import { ActionSheet, Avatar } from '@/components/skysolo-ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { fetchConversationsApi } from '@/redux-stores/slice/conversation/api.service';
import { resetConversation, resetConversationState } from '@/redux-stores/slice/conversation';
import debounce from '@/lib/debouncing';
import searchText from '@/lib/TextSearch';
import ErrorScreen from '@/components/error/page';
import { ConversationDetailsSheet, ConversationItem, ListHeader } from '@/components/message';
import ListEmpty from '@/components/ListEmpty';
import { Loader, useTheme } from "hyper-native-ui";
import { useNavigation } from '@react-navigation/native';
import { ConversationLoader } from '@/components/message/conversationItem';

let totalFetchedItemCount: number = 0;
let pageLoaded = false;

const ChatListScreen = memo(function ChatListScreen() {
    const navigation = useNavigation();
    const stopRef = useRef(false);
    const list = useSelector((Root: RootState) => Root.ConversationState.conversationList);
    const listLoading = useSelector((Root: RootState) => Root.ConversationState.listLoading);
    const listError = useSelector((Root: RootState) => Root.ConversationState.listError);

    const [BottomSheetData, setBottomSheetData] = useState<Conversation | null>(null)
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", '50%', "70%"], []);
    const [inputText, setInputText] = useState("");
    const dispatch = useDispatch();

    const conversationList = useMemo(() => {
        return [...list].sort((a, b) => {
            if (a.lastMessageCreatedAt && b.lastMessageCreatedAt) {
                return new Date(b.lastMessageCreatedAt).getTime() - new Date(a.lastMessageCreatedAt).getTime()
            }
            return 0
        })
            .filter((item) => item.lastMessageCreatedAt !== null)
            .filter((item) => searchText(item?.user?.name, inputText))
    }, [list, inputText])

    const handlePresentModalPress = useCallback((data: Conversation) => {
        setBottomSheetData(data)
        bottomSheetModalRef.current?.present();
        Vibration.vibrate(1 * 50, false);
    }, [])

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setBottomSheetData(null)
        }
    }, []);
    const onChangeInput = debounce((text: string) => setInputText(text), 400)

    const pushToPage = useCallback((data: Conversation) => {
        navigation?.navigate("MessageRoom", { id: data.id });
    }, [])

    // fetch -------------------------------------------------------------------------------------

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchConversationsApi({
                limit: 12,
                offset: totalFetchedItemCount
            }) as any) as disPatchResponse<Conversation[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [])

    const onEndReached = useCallback(() => {
        if (stopRef.current || totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetConversationState())
        fetchApi()
    }, [])

    useEffect(() => {
        if (!pageLoaded) {
            pageLoaded = true
            onRefresh()
        }
    }, [])

    return <View style={{
        flex: 1,
        width: "100%",
        height: "100%",
    }}>
        <FlatList
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={({ item }) => <ConversationItem
                data={item}
                onClick={pushToPage}
                onLongPress={handlePresentModalPress} />}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            windowSize={10}
            bounces={false}
            refreshing={false}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            ListHeaderComponent={<ListHeader
                pageToNewChat={() => { navigation?.navigate("FindMessage") }}
                InputOnChange={onChangeInput} />}
            data={conversationList}
            ListEmptyComponent={() => {
                if (conversationList.length === 0 && (listLoading === "idle" || listLoading === "pending")) {
                    return <ConversationLoader size={12} />
                }
                if (listError) return <ErrorScreen message={listError} />
                if (!listError && listLoading === "normal") return <ListEmpty text="No Messages" />
            }}
            ListFooterComponent={listLoading === "pending" ? <Loader size={50} /> : <></>}
        />
        <ActionSheet
            bottomSheetModalRef={bottomSheetModalRef}
            snapPoints={snapPoints}
            handleSheetChanges={handleSheetChanges}>
            <ConversationDetailsSheet data={BottomSheetData} />
        </ActionSheet>
        <ActionButton onPress={() => { navigation?.navigate("AiMessage") }} />
    </View>
})
export default ChatListScreen;

const ActionButton = memo(function ActionButton({ onPress }: { onPress: () => void }) {
    const { currentTheme } = useTheme();
    return <View style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        borderColor: currentTheme?.border,
        borderWidth: 2,
        borderRadius: 100,
        elevation: 5,
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
        backgroundColor: "white",
    }}>
        <View style={{
            width: 46,
            height: 46,
            backgroundColor: "white",
            borderRadius: 100,
        }}>
            <Avatar
                serverImage={false}
                onPress={onPress}
                url={require("../../assets/images/ai.png")}
                size={42} />
        </View>
    </View>
}, () => true)