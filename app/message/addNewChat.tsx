import AppHeader from "@/components/AppHeader";
import { ListEmptyComponent } from "@/components/home";
import { Avatar, Input, Loader, TouchableOpacity, Text } from "@/components/skysolo-ui";
import debounce from "@/lib/debouncing";
import { setConversation } from "@/redux-stores/slice/conversation";
import { CreateConversationApi } from "@/redux-stores/slice/conversation/api.service";
import { searchUsersProfileApi } from "@/redux-stores/slice/users/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, Conversation, disPatchResponse, NavigationProps } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useRef } from "react";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const NewChatScreen = memo(function NewChatScreen({
    navigation
}: {
    navigation: NavigationProps
}) {
    const users = useSelector((Root: RootState) => Root.UsersState.searchUsers)
    const loading = useSelector((Root: RootState) => Root.UsersState.searchUsersLoading)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const inputText = useRef<string>('')

    const fetchUsers = useCallback(async (text: string) => {
        try {
            if (stopRef.current || text.length <= 0) return
            inputText.current = text
            await dispatch(searchUsersProfileApi(text) as any)
        } finally {
            stopRef.current = false
        }
    }, [])

    const delayFetchUsers = debounce(fetchUsers, 600)

    const onNavigate = useCallback(async (userData: AuthorData) => {
        const res = await dispatch(CreateConversationApi([userData.id]) as any) as disPatchResponse<Conversation>
        if (res.error) return ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
        dispatch(setConversation({
            id: res.payload.id,
            isGroup: false,
            user: userData,
        } as Conversation))
        navigation?.navigate("message/conversation", { id: res.payload.id })
    }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader navigation={navigation} title='New Message' />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                justifyContent: 'space-between',
            }}>
                <Input placeholder="Search"
                    leftSideComponent={<Text variant="heading3" colorVariant="secondary" style={{
                        paddingHorizontal: 5,
                        marginRight: 4
                    }}>To :</Text>}
                    onChangeText={delayFetchUsers}
                    style={{
                        width: "90%",
                        borderRadius: 30,
                        borderWidth: 0,
                    }} />
            </View>

            {/* list */}
            <FlashList
                data={users}
                renderItem={({ item }) => <UserItem data={item}
                    onPress={onNavigate} />}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                bounces={false}
                ListFooterComponent={() => <>{loading ? <Loader size={50} /> : <></>}</>}
                ListEmptyComponent={!loading ? <ListEmptyComponent text="No User yet" /> : <></>} />
        </View>
    )
})
export default NewChatScreen;

const UserItem = memo(function UserItem({
    data, onPress
}: {
    data: AuthorData,
    onPress: (text: AuthorData) => void,
}) {
    return (<TouchableOpacity
        onPress={() => onPress(data)}
        style={{
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center',
            width: '100%',
            gap: 10,
            marginVertical: 2,
            justifyContent: 'space-between',
        }}>
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
            }}>
            <Avatar url={data.profilePicture} size={60} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Text variant="heading3">{data.name}</Text>
                    <Text variant="heading4">{data.username}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})