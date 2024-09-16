import { FlashList } from '@shopify/flash-list';
// import chatList from "@/data/chatlist.json"
import { memo, useContext, useMemo, useRef } from 'react';
import { View as RNView } from 'react-native';
import { Conversation } from '@/types';
import { Avatar, Icon, Input, Text, TouchableOpacity, View } from '@/components/skysolo-ui';
// import { useDispatch } from 'react-redux';
// import debouncing from '@/lib/debouncing';
import { NavigationContext } from '@react-navigation/native';

const ChatListScreen = memo(function ChatListScreen() {
    const navigation = useContext(NavigationContext);
    // const dispatch = useDispatch()
    // const stopRef = useRef(false)

    const pushToPage = (id: string) => {
        navigation?.navigate("chat", { id })
    }

    const pressBack = () => {
        navigation?.goBack()
    }

    // const delayFunc = () => {
    //     stopRef.current = false
    //     // dispatch(tabSwipeEnabled(true))
    // }

    // const debouncingFunc = useMemo(() => debouncing(delayFunc, 500), [])

    const list: Conversation[] = [...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList,] as any

    return <View style={{
        width: "100%",
        height: "100%",
    }}>
        <FlashList
            // onScroll={(e) => {
            //     debouncingFunc()
            //     if (stopRef.current) return
            //     stopRef.current = true
            //     dispatch(tabSwipeEnabled(false))
            // }}
            renderItem={({ item }) => <Item data={item} onClick={pushToPage} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={400}
            estimatedItemSize={5}
            ListHeaderComponent={<ListHeaderComponent pressBack={pressBack} />}
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

const ListHeaderComponent = memo(function ({
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
                    gap: 5,
                }}>
                    <Icon iconName={"ArrowLeft"} size={30} onPress={pressBack} />
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "700",
                            lineHeight: 20,
                        }}
                        variant="heading1">
                        @akashmondal
                    </Text>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <Icon iconName={"SquarePen"} size={26} />
                </View>
            </View>
            <Input secondaryColor style={{ borderWidth: 0 }} placeholder='Search' />
        </View>
        <Text
            style={{
                fontSize: 20,
                fontWeight: "500",
                lineHeight: 20,
                paddingHorizontal: 18,
                paddingVertical: 6,
            }}
            variant="heading4">
            Messages
        </Text>
    </>
})

const chatList = [
    {
        "id": "g2gijpoask",
        "members": [
            "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "30840219-080e-4566-b659-bd1b63e697e2"
        ],
        "authorId": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
        "user": {
            "id": "2d1a43de-d6e9-4136-beb4-974a9fcc3c8b",
            "username": "akash",
            "email": "akash@gmail.com",
            "name": "Akash Mondal",
            "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F2d1a43de-d6e9-4136-beb4-974a9fcc3c8b%2Fimg_1_1720545118665.webp.jpeg?alt=media&token=093f6305-03aa-4a37-9e68-294ebce58956"
        },
        "isGroup": false,
        "lastMessageContent": "Wwww",
        "totalUnreadMessagesCount": 0,
        "lastMessageCreatedAt": "2024-09-04T06:25:50.939Z",
        "createdAt": null,
        "updatedAt": "2024-08-15T00:01:02.000Z",
        "groupName": null,
        "groupImage": null,
        "groupDescription": null,
        "messages": []
    }
]