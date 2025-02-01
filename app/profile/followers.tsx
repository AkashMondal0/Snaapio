/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FlatList, View, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@/components/skysolo-ui";
import { fetchUserProfileFollowerUserApi } from "@/redux-stores/slice/profile/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, Conversation, disPatchResponse, loadingType, NavigationProps } from "@/types";
import { memo, useCallback, useEffect, useRef } from "react";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import { setConversation } from "@/redux-stores/slice/conversation";
import { CreateConversationApi } from "@/redux-stores/slice/conversation/api.service";
import { Button, Loader, Text, TouchableOpacity } from "hyper-native-ui";
import { StackActions, useNavigation } from "@react-navigation/native";
import UserItemLoader from "@/components/loader/user-loader";

interface ScreenProps {
    username: string
}

const FollowersScreen = memo(function FollowersScreen({ username }: ScreenProps) {
    const navigation = useNavigation()
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const [loading, setLoading] = useState<loadingType>('idle')
    const [error, setError] = useState<string | null>(null)
    const users = useRef<AuthorData[]>([])
    const totalFetchedItemCount = useRef(0)
    const dispatch = useDispatch()

    const fetchData = useCallback(async () => {
        if (loading === "pending" || totalFetchedItemCount.current === -1) return
        setLoading("pending")
        try {
            const res = await dispatch(fetchUserProfileFollowerUserApi({
                username: username,
                offset: totalFetchedItemCount.current,
                limit: 12
            }) as any) as disPatchResponse<AuthorData[]>
            if (res.error) {
                setError(res?.error?.message || "An error occurred")
                return
            }
            if (res.payload.length <= 0) {
                totalFetchedItemCount.current = -1
                return
            }
            users.current.push(...res.payload)
            totalFetchedItemCount.current += res.payload.length
        } finally {
            setLoading("normal")
        }
    }, [loading])

    const onEndReached = useCallback(() => {
        if (totalFetchedItemCount.current < 10 || loading === "pending" || loading === "idle") return
        fetchData()
    }, [loading])

    const onRefresh = useCallback(() => {
        if (loading === "pending" || loading === "idle") return
        setLoading("pending")
        users.current = []
        totalFetchedItemCount.current = 0
        fetchData()
    }, [loading])

    const navigationHandler = useCallback((uname: string) => {
        navigation.dispatch(StackActions.push("Profile", { id: uname }));
    }, [])

    useEffect(() => {
        users.current = []
        totalFetchedItemCount.current = 0
        fetchData()
    }, [])

    const navigateToMessagePage = async (userData: AuthorData) => {
        try {
            if (!session?.id) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            if (!userData || userData?.id === session?.id) return ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            const res = await dispatch(CreateConversationApi([userData.id]) as any) as disPatchResponse<Conversation>
            if (res.error) return ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            dispatch(setConversation({
                id: res.payload.id,
                isGroup: false,
                user: userData,
            } as Conversation))
            navigation?.navigate("MessageRoom", { id: res.payload.id })
        } catch (error) {
            ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
        }
    }

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
                data={users.current}
                renderItem={({ item }) => (<FollowingItem data={item}
                    navigateToMessagePage={navigateToMessagePage}
                    isFollowing={session?.username === item.username}
                    onPress={navigationHandler} />)}
                keyExtractor={(item, index) => index.toString()}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                refreshing={false}
                onRefresh={onRefresh}
                ListEmptyComponent={() => {
                    if (loading === "idle" || loading === "pending") return <UserItemLoader />
                    if (error) return <ErrorScreen message={error} />
                    if (!error && loading === "normal") return <ListEmpty text="No followers yet" />
                }}
                ListFooterComponent={loading === "pending" ? <Loader size={50} /> : <></>}
            />
        </View>
    )
})
export default FollowersScreen;

const FollowingItem = memo(function FollowingItem({
    data,
    isFollowing,
    onPress,
    navigateToMessagePage
}: {
    data: AuthorData,
    isFollowing: boolean,
    onPress: (uname: string) => void
    navigateToMessagePage: (userData: AuthorData) => void
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
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
        }}>
            <Avatar url={data.profilePicture} size={60} onPress={() => onPress(data.username)} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Text variant="H6">
                        {data.username}
                    </Text>
                </View>
                <Text variantColor="secondary">
                    {data.name}
                </Text>
            </View>
        </View>
        {isFollowing ? <Text>You</Text> : <Button
            textStyle={{
                fontSize: 14,
            }}
            onPress={() => navigateToMessagePage(data)}
            size="medium"
            variant="secondary">
            Message
        </Button>}
    </TouchableOpacity>)
})