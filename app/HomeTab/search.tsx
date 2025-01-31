import { ListEmptyComponent } from "@/components/home";
import { Avatar, Icon, } from "@/components/skysolo-ui";
import debounce from "@/lib/debouncing";
import { searchUsersProfileApi } from "@/redux-stores/slice/users/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData } from "@/types";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Input, Text, Loader, TouchableOpacity } from "hyper-native-ui";
import { memo, useCallback, useRef } from "react";
import { FlatList, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const SearchScreen = memo(function SearchScreen() {
    const navigation = useNavigation();
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
                        if (navigation.canGoBack()) {
                            navigation.goBack()
                        }
                    }} />
                <Input placeholder="Search people"
                    onChangeText={delayFetchUsers}
                    style={{
                        width: "90%",
                        borderRadius: 30,
                        borderWidth: 0,
                    }} />
            </View>

            {/* list */}
            <FlatList
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                data={users}
                renderItem={({ item }) => <UserItem data={item} onRemove={onRemove} />}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                bounces={false}
                ListFooterComponent={() => <View>{loading ? <Loader size={50} /> : <View></View>}</View>}
                ListEmptyComponent={!loading ? <ListEmptyComponent text="No User yet" /> : <View></View>} />
        </View>
    )
})
export default SearchScreen;

const UserItem = memo(function UserItem({
    data, onRemove
}: {
    data: AuthorData,
    onRemove: (text: string) => void
}) {
    const navigation = useNavigation();
    return (<TouchableOpacity
        onPress={() => navigation.dispatch(StackActions.replace("Profile", { id: data.username }))}
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
                    <Text variant="H6">{data.name}</Text>
                    <Text>{data.username}</Text>
                </View>
            </View>
        </View>
        <Icon iconName="X" size={30} iconColorVariant="secondary" onPress={() => onRemove(data.id)} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})