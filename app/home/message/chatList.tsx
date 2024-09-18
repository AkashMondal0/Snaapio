import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useRef, memo, useContext } from 'react';
import { View as RNView, Vibration } from 'react-native';
import { Conversation } from '@/types';
import { Avatar, Icon, Input, Text, TouchableOpacity, View } from '@/components/skysolo-ui';
import { NavigationContext } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SkysoloActionSheet from '@/components/skysolo-ui/ActionSheet';

const ChatListScreen = memo(function ChatListScreen() {
    const navigation = useContext(NavigationContext);
    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ['50%', "70%"], []);

    // callbacks
    const handlePresentModalPress = useCallback((data: any) => {
        bottomSheetModalRef.current?.present();
        Vibration.vibrate(1 * 50, false);
    }, [])

    const handleSheetChanges = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);

    const pushToPage = (id: string) => {
        navigation?.navigate("chat", { id })
    }

    const pressBack = () => {
        navigation?.goBack()
    }

    const list: Conversation[] = [...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList, ...chatList,] as any

    return <View style={{
        width: "100%",
        height: "100%",
    }}>
        <FlashList
            renderItem={({ item }) => <Item data={item} onClick={pushToPage} onLongPress={handlePresentModalPress} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={400}
            estimatedItemSize={5}
            ListHeaderComponent={<ListHeaderComponent pressBack={pressBack} />}
            data={list} />
        <SkysoloActionSheet
            bottomSheetModalRef={bottomSheetModalRef}
            snapPoints={snapPoints}
            handleSheetChanges={handleSheetChanges}>
            <ChatDetailsSheetChildren />
        </SkysoloActionSheet>
    </View>
})
export default ChatListScreen;

const Item = memo(function Item({
    data,
    onClick,
    onLongPress
}: {
    data: Conversation,
    onClick: (id: string) => void,
    onLongPress: (data: any) => void
}) {


    return (<View style={{ paddingHorizontal: 6 }}>
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
            <Avatar size={55} url={data.user?.profilePicture} onLongPress={() => { onLongPress(data) }} />
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
    return <RNView style={{ flex: 1 }}>
        <Text>Awesome 🎉</Text>
    </RNView>
}

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
