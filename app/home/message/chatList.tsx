import { FlashList } from '@shopify/flash-list';
import chatList from "@/data/chatlist.json"
import { memo, useContext, useMemo, useRef } from 'react';
import { View as RNView } from 'react-native';
import { Conversation } from '@/types';
import { Avatar, Text, TouchableOpacity, View } from '@/components/skysolo-ui';
import { useDispatch } from 'react-redux';
import { tabSwipeEnabled } from '@/redux-stores/slice/theme';
import debouncing from '@/lib/debouncing';
import { NavigationContext } from '@react-navigation/native';
const paddingVertical = 10

const ChatListScreen = memo(function ChatListScreen() {
    const navigation = useContext(NavigationContext);
    const dispatch = useDispatch()
    const stopRef = useRef(false)

    const pushToPage = (id: string) => {
        navigation?.navigate("chat", { id })
    }

    const delayFunc = () => {
        stopRef.current = false
        dispatch(tabSwipeEnabled(true))
    }

    const debouncingFunc = useMemo(() => debouncing(delayFunc, 500), [])

    const list: Conversation[] = [...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList,] as any

    return <View style={{
        width: "100%",
        height: "100%",
    }}>
        <FlashList
            onScroll={(e) => {
                debouncingFunc()
                if (stopRef.current) return
                stopRef.current = true
                dispatch(tabSwipeEnabled(false))
            }}
            renderItem={({ item }) => <Item data={item} onClick={pushToPage} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={400}
            estimatedItemSize={5}
            data={list} />
    </View>
})
export default ChatListScreen;

const Item = memo(function ({ data, onClick }: { data: Conversation, onClick: (id: string) => void }) {


    return <View style={{
        paddingHorizontal: 6,
    }}>
        <TouchableOpacity
            onPress={() => { onClick(data?.id) }}
            style={{
                width: "100%",
                padding: 10,
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderRadius: 15
            }}>
            <Avatar size={55} url={data.user?.profilePicture} />
            <RNView>
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
            </RNView>
        </TouchableOpacity>
    </View>
}, ((prev, next) => prev.data.id === next.data.id))