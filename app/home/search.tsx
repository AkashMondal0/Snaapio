import { ListEmptyComponent } from "@/components/home";
import { Avatar, Icon, Input, Loader, TouchableOpacity, Text } from "@/components/skysolo-ui";
import debounce from "@/lib/debouncing";
import { searchUsersProfileApi } from "@/redux-stores/slice/users/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, NavigationProps } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useRef } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const SearchScreen = memo(function SearchScreen({
    navigation
}: {
    navigation: NavigationProps
}) {
    const users = useSelector((Root: RootState) => Root.UsersState.searchUsers)
    const loading = useSelector((Root: RootState) => Root.UsersState.searchUsersLoading)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const inputText = useRef<string>('')

    // const userList = useMemo(() => {
    //     return [...users].filter((item) => searchText(item?.name, inputText.current))
    // }, [inputText, users])

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

    const onNavigate = useCallback((username: string) => {
        navigation.navigate("profile", { screen: 'profile', params: { username } });
    }, [])

    const onRemove = useCallback((id: string) => {
    }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                justifyContent: 'space-between',
            }}>
                <Icon iconName="ArrowLeft"
                    size={32}
                    onPress={() => {
                        navigation.goBack()
                    }} />
                <Input placeholder="Search people"
                    secondaryColor
                    onChangeText={delayFetchUsers}
                    style={{
                        width: "90%",
                        borderRadius: 30,
                        borderWidth: 0,
                    }} />
            </View>

            {/* list */}
            <FlashList
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                data={users}
                renderItem={({ item }) => <UserItem data={item}
                    onPress={onNavigate} onRemove={onRemove} />}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                bounces={false}
                ListFooterComponent={() => <>{loading ? <Loader size={50} /> : <></>}</>}
                ListEmptyComponent={!loading ? <ListEmptyComponent text="No User yet" /> : <></>} />
        </View>
    )
})
export default SearchScreen;

const UserItem = memo(function UserItem({
    data, onPress, onRemove
}: {
    data: AuthorData,
    onPress: (text: string) => void,
    onRemove: (text: string) => void
}) {
    return (<TouchableOpacity
        onPress={() => onPress(data.username)}
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
            <Avatar url={data.profilePicture} size={50} />
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
        <Icon iconName="X" size={30} iconColorVariant="secondary" onPress={() => onRemove(data.id)} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})