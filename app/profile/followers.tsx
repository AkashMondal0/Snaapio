import React from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Loader, Text, TouchableOpacity } from "@/components/skysolo-ui";
import { fetchUserProfileFollowerUserApi } from "@/redux-stores/slice/profile/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, disPatchResponse, NavigationProps } from "@/types";
import { memo, useCallback, useEffect, useRef } from "react";
import { resetProfileFollowList } from "@/redux-stores/slice/profile";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            username: string
        }
    }
}
let totalFetchedItemCount = 0
let profileId = "NO_ID"

const FollowersScreen = memo(function FollowersScreen({ navigation, route }: ScreenProps) {
    // console.log(route.params.username)
    const username = useSelector((Root: RootState) => Root.ProfileState.state?.username)
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const followersList = useSelector((Root: RootState) => Root.ProfileState.followerList)
    const listLoading = useSelector((Root: RootState) => Root.ProfileState.followerListLoading)
    const listError = useSelector((Root: RootState) => Root.ProfileState.followerListError)

    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const onPress = (item: AuthorData) => {
        // navigation.navigate('Profile', { username: item.username })
    }

    // v1 fetch ---------------------
    const fetchApi = useCallback(async () => {
        if (!username) return ToastAndroid.show("User not found", ToastAndroid.SHORT)
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchUserProfileFollowerUserApi({
                username: username,
                offset: totalFetchedItemCount,
                limit: 12,
            }) as any) as disPatchResponse<AuthorData[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [username])

    useEffect(() => {
        if (profileId !== username) {
            profileId = username || "NO_ID"
            totalFetchedItemCount = 0
            dispatch(resetProfileFollowList())
            fetchApi()
        }
    }, [username])

    const onEndReached = useCallback(() => {
        if (stopRef.current || totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetProfileFollowList())
        fetchApi()
    }, [])


    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <FlatList
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                data={followersList}
                renderItem={({ item }) => (<FollowingItem data={item}
                    isFollowing={session?.username === item.username}
                    onPress={onPress} />)}
                keyExtractor={(item, index) => index.toString()}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                refreshing={false}
                onRefresh={onRefresh}
                ListEmptyComponent={() => {
                    if (listLoading === "idle") return <View />
                    if (listError) return <ErrorScreen message={listError} />
                    if (!listError && listLoading === "normal") return <ListEmpty text="No followers yet" />
                }}
                ListFooterComponent={listLoading === "pending" ? <Loader size={50} /> : <></>}
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
        {isFollowing ? <Text>You</Text> : <Button
            textStyle={{
                fontSize: 14,
            }}
            size="medium"
            variant="secondary">
            Message
        </Button>}
    </TouchableOpacity>)
})