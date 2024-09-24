import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Loader, Text, TouchableOpacity } from "@/components/skysolo-ui";
import debounce from "@/lib/debouncing";
import { fetchUserProfileFollowerUserApi } from "@/redux-stores/slice/profile/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, disPatchResponse, NavigationProps } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { ListEmptyComponent } from "@/components/home";
import { resetProfileFollowList } from "@/redux-stores/slice/profile";
interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            username: string
        }
    }
}

const FollowersScreen = memo(function FollowersScreen({ navigation, route }: ScreenProps) {
    const username = useSelector((Root: RootState) => Root.ProfileState.state?.username)
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const followersList = useSelector((Root: RootState) => Root.ProfileState.followerList)
    const listLoading = useSelector((Root: RootState) => Root.ProfileState.followerListLoading)
    const stopRef = useRef(false)
    const totalFetchedItemCount = useRef<number>(0)
    const [firstFetchAttend, setFirstFetchAttend] = useState(true)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async (reset?: boolean) => {
        if (!username) return console.warn('username not found')
        if (stopRef.current || totalFetchedItemCount.current === -1) return
        try {
            const res = await dispatch(fetchUserProfileFollowerUserApi({
                username: username,
                offset: reset ? 0 : totalFetchedItemCount.current,
                limit: 12,
            }) as any) as disPatchResponse<AuthorData[]>

            if (res.payload?.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload?.length < 12) {
                    return totalFetchedItemCount.current = -1
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount.current += res.payload.length
            }
        } finally {
            if (firstFetchAttend) {
                setFirstFetchAttend(false)
            }
            stopRef.current = false
        }
    }, [username])

    const fetchList = debounce(fetchApi, 1000)

    const onRefresh = useCallback(() => {
        totalFetchedItemCount.current = 0
        dispatch(resetProfileFollowList())
        fetchApi(true)
    }, [])

    const onPress = (item: AuthorData) => {
        // navigation.navigate('Profile', { username: item.username })
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <FlashList
                data={followersList}
                renderItem={({ item }) => (<FollowingItem data={item}
                    isFollowing={session?.username === item.username}
                    onPress={onPress} />)}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={fetchList}
                refreshing={false}
                onRefresh={onRefresh}
                ListFooterComponent={() => <>{listLoading || !listLoading && firstFetchAttend ? <Loader size={50} /> : <></>}</>}
                ListEmptyComponent={!firstFetchAttend && followersList.length <= 0 ? <ListEmptyComponent text="No followings yet" /> : <></>}
            />
        </View>
    )
})
export default FollowersScreen;

const FollowingItem = memo(function FollowingItem({
    data,
    isFollowing,
    onPress
}: {
    data: AuthorData,
    isFollowing: boolean,
    onPress: (item: AuthorData) => void
}) {
    return (<TouchableOpacity style={{
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        width: '100%',
        gap: 10,
        marginVertical: 2,
        justifyContent: 'space-between',
    }}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
        }}>
            <Avatar url={data.profilePicture} size={50} onPress={() => onPress(data)} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Text variant="heading3">
                        {data.username}
                    </Text>
                </View>
                <Text variant="heading4" colorVariant="secondary">
                    {data.name}
                </Text>
            </View>
        </View>
        {isFollowing?<Text>You</Text>:<Button
            textStyle={{
                fontSize: 14,
            }}
            size="medium"
            variant="secondary">
            Message
        </Button>}
    </TouchableOpacity>)
})