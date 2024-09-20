import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useRef, memo, useState } from 'react';
import { View, Vibration } from 'react-native';
import { Conversation, disPatchResponse } from '@/types';
import { ActionSheet, Avatar, Icon, Input, Text, TouchableOpacity } from '@/components/skysolo-ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { fetchConversationsApi } from '@/redux-stores/slice/conversation/api.service';
import { setConversation } from '@/redux-stores/slice/conversation';
let totalFetchedItemCount: number | null = 0

const ChatListScreen = memo(function ChatListScreen({ navigation }: any) {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const stopRef = useRef(false)
    const [finishedFetching, setFinishedFetching] = useState(false)
    const list = useSelector((Root: RootState) => Root.ConversationState.conversationList)
    const snapPoints = useMemo(() => ['50%', "70%"], []);
    const dispatch = useDispatch()

    const conversationList = useMemo(() => {
        return [...list].sort((a, b) => {
            if (a.lastMessageCreatedAt && b.lastMessageCreatedAt) {
                return new Date(b.lastMessageCreatedAt).getTime() - new Date(a.lastMessageCreatedAt).getTime()
            }
            return 0
        }).filter((item) => item.lastMessageCreatedAt !== null)
    }, [list])


    const fetchConversationList = useCallback(async () => {
        if (stopRef.current) return
        if (totalFetchedItemCount === null) return setFinishedFetching(true)
        try {
            const res = await dispatch(fetchConversationsApi({
                limit: 12,
                offset: totalFetchedItemCount
            }) as any) as disPatchResponse<Conversation[]>
            if (res.payload.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload.length < 12) {
                    setFinishedFetching(true)
                    return totalFetchedItemCount = null
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
        bottomSheetModalRef.current?.present();
        Vibration.vibrate(1 * 50, false);
    }, [])

    const handleSheetChanges = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);

    const pushToPage = useCallback((data: Conversation) => {
        dispatch(setConversation(data))
        navigation?.navigate("chat", { id: data.id })
    }, [])

    const pressBack = useCallback(() => {
        navigation?.goBack()
    }, [])

    return <View style={{
        width: "100%",
        height: "100%",
    }}>
        <FlashList
            renderItem={({ item }) => <Item data={item}
                onClick={pushToPage}
                onLongPress={handlePresentModalPress} />}
            keyExtractor={(item, index) => index.toString()}
            estimatedItemSize={5}
            onEndReachedThreshold={0.5}
            bounces={false}
            onEndReached={fetchConversationList}
            ListHeaderComponent={<ListHeaderComponent pressBack={pressBack} />}
            data={conversationList} />
        <ActionSheet
            bottomSheetModalRef={bottomSheetModalRef}
            snapPoints={snapPoints}
            handleSheetChanges={handleSheetChanges}>
            <ChatDetailsSheetChildren />
        </ActionSheet>
    </View>
})
export default ChatListScreen;

const Item = memo(function Item({
    data,
    onClick,
    onLongPress
}: {
    data: Conversation,
    onClick: (id: Conversation) => void,
    onLongPress: (data: Conversation) => void
}) {
    return (<View style={{ paddingHorizontal: 6 }}>
        <TouchableOpacity
            onPress={() => { onClick(data) }}
            style={{
                width: "100%",
                padding: 10,
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderRadius: 15
            }}>
            <Avatar size={55} url={data.user?.profilePicture} onLongPress={() => { onLongPress(data) }} />
            <View>
                <Text
                    style={{ fontWeight: "600" }}
                    variant="heading3">
                    {data?.user?.name}
                </Text>
                <Text
                    secondaryColor
                    style={{ fontWeight: "400" }}
                    variant="heading4">
                    {data?.lastMessageContent ?? "new chat"}
                </Text>
            </View>
        </TouchableOpacity>
    </View>)
}, ((prev, next) => prev.data.id === next.data.id))

const ListHeaderComponent = memo(function ListHeaderComponent({
    pressBack
}: {
    pressBack: () => void
}) {

    return <>
        <View style={{
            paddingHorizontal: 14,
            paddingBottom: 10,
        }}>
            <View style={{
                width: "100%",
                display: "flex", flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 16,
            }}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                }}>
                    <Icon iconName={"ArrowLeft"} size={30} onPress={pressBack} />
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: "400",
                        }}>
                        @akashmondal
                    </Text>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <Icon iconName={"SquarePen"} size={26} />
                </View>
            </View>
            <Input secondaryColor style={{ borderWidth: 0 }} placeholder='Search' />
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "500",
                    lineHeight: 20,
                    paddingTop: 16,
                    paddingHorizontal: 10,
                }}
                variant="heading4">
                Messages
            </Text>
        </View>
    </>
})

const ChatDetailsSheetChildren = () => {
    return <View style={{ flex: 1 }}>
        <Text>Awesome 🎉</Text>
    </View>
}
