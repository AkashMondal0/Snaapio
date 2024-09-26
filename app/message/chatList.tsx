/* eslint-disable react-hooks/exhaustive-deps */
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useRef, memo, useState } from 'react';
import { View, Vibration } from 'react-native';
import { Conversation, disPatchResponse } from '@/types';
import { ActionSheet, Loader } from '@/components/skysolo-ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { fetchConversationsApi } from '@/redux-stores/slice/conversation/api.service';
import { resetConversationState, setConversation } from '@/redux-stores/slice/conversation';
import debounce from '@/lib/debouncing';
import searchText from '@/lib/TextSearch';
import { ListEmptyComponent } from '@/components/home';
import ErrorScreen from '@/components/error/page';
import { ConversationDetailsSheet, ConversationItem, ListHeader } from '@/components/message';
let totalFetchedItemCount: number = 0

const ChatListScreen = memo(function ChatListScreen({ navigation }: any) {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const stopRef = useRef(false)
    const list = useSelector((Root: RootState) => Root.ConversationState.conversationList)
    const listLoading = useSelector((Root: RootState) => Root.ConversationState.listLoading)
    const listError = useSelector((Root: RootState) => Root.ConversationState.listError)

    const snapPoints = useMemo(() => ["50%", '50%', "70%"], []);
    const [inputText, setInputText] = useState("")
    const [BottomSheetData, setBottomSheetData] = useState<Conversation | null>(null)
    const dispatch = useDispatch()

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

    const fetchConversationList = useCallback(async (reset?: boolean) => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        // console.log("fetching")
        try {
            const res = await dispatch(fetchConversationsApi({
                limit: 12,
                offset: reset ? 0 : totalFetchedItemCount
            }) as any) as disPatchResponse<Conversation[]>
            if (res.payload.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload.length < 12) {
                    // setFinishedFetching(true)
                    return totalFetchedItemCount = -1
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount += 12
            }
        } finally {
            stopRef.current = false
        }
    }, [])

    // callbacks
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

    const pushToPage = useCallback((data: Conversation) => {
        dispatch(setConversation(data))
        navigation?.navigate("message/conversation", { id: data.id })
    }, [])

    const onChangeInput = debounce((text:string)=>setInputText(text), 400)

    const fetchConversations = debounce(fetchConversationList, 500)

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetConversationState())
        fetchConversationList(true)
    }, [])

    return <View style={{
        width: "100%",
        height: "100%",
    }}>
        <FlashList
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={({ item }) => <ConversationItem data={item}
                onClick={pushToPage}
                onLongPress={handlePresentModalPress} />}
            keyExtractor={(item, index) => index.toString()}
            estimatedItemSize={5}
            onEndReachedThreshold={0.5}
            bounces={false}
            refreshing={false}
            onRefresh={onRefresh}
            onEndReached={fetchConversations}
            ListHeaderComponent={<ListHeader
                pageToNewChat={() => { navigation?.navigate("message/searchNewChat") }}
                pressBack={() => { navigation?.goBack() }}
                InputOnChange={onChangeInput} />}
            data={conversationList}
            ListFooterComponent={() => <>{listLoading ? <Loader size={50} /> : <></>}</>}
            ListEmptyComponent={() => {
                if (listError) {
                    return <ErrorScreen message={listError} />
                }
                if (conversationList.length <= 0 && !listLoading && !listError) {
                    return <ListEmptyComponent text="No Chat yet" />
                }
            }} />
        <ActionSheet
            bottomSheetModalRef={bottomSheetModalRef}
            snapPoints={snapPoints}
            handleSheetChanges={handleSheetChanges}>
            <ConversationDetailsSheet data={BottomSheetData} />
        </ActionSheet>
    </View>
})
export default ChatListScreen;
