import React from "react";
import AppHeader from "@/components/AppHeader";
import { ListEmptyComponent } from "@/components/home";
import { Avatar } from "@/components/skysolo-ui";
import { Input, TouchableOpacity, Text } from 'hyper-native-ui';
import debounce from "@/lib/debouncing";
import { CreateConversationApi } from "@/redux-stores/slice/conversation/api.service";
import { searchUsersProfileApi } from "@/redux-stores/slice/users/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, Conversation, disPatchResponse } from "@/types";
import { memo, useCallback, useRef } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ErrorScreen from "@/components/error/page";
import { ConversationLoader } from "@/components/message/conversationItem";

const NewChatScreen = memo(function NewChatScreen() {
    const users = useSelector((Root: RootState) => Root.UsersState.searchUsers)
    const loading = useSelector((Root: RootState) => Root.UsersState.searchUsersLoading)
    const error = useSelector((Root: RootState) => Root.UsersState.searchUsersError)
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const inputText = useRef<string>('')
    const navigation = useNavigation();

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
        if (session?.id === userData.id) return ToastAndroid.show("You can't chat with yourself", ToastAndroid.SHORT)
        const res = await dispatch(CreateConversationApi([userData]) as any) as disPatchResponse<Conversation>
        if (res.error) return ToastAndroid.show("Something went wrong, please try again", ToastAndroid.SHORT)
        navigation?.navigate("MessageRoom", { id: res.payload.id });
    }, [])

    return (
        <View style={{
            flex: 1
        }}>
            <AppHeader title='New Message' />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                justifyContent: 'space-between',
            }}>
                <Input placeholder="Search"
                    leftSideComponent={<View>
                        <Text variantColor="secondary" style={{
                            paddingHorizontal: 5,
                            marginRight: 4
                        }}>To :</Text>
                    </View>}
                    onChangeText={delayFetchUsers}
                    containerStyle={{ width: "100%" }}
                    style={{
                        borderRadius: 30,
                        borderWidth: 0,
                    }} />
            </View>
            {/* list */}
            <FlatList
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                data={users}
                renderItem={({ item }) => <UserItem data={item}
                    onPress={onNavigate} />}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                bounces={false}
                ListHeaderComponent={() => <>{loading === "pending" ? <ConversationLoader size={6} /> : <></>}</>}
                ListEmptyComponent={() => {
                    if (loading === "pending") {
                        return <ConversationLoader size={6} />
                    }
                    if (error) return <ErrorScreen />
                    if (!error && loading === "normal") return <ListEmptyComponent text="No User yet" />
                }}
            />
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
                    <Text variant="H6">{data.name}</Text>
                    <Text>{data.username}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})
ConversationLoader