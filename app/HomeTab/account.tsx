import { disPatchResponse, loadingType, Post, User } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ProfileEmptyPosts, ProfileGridItem, ProfileHeader, ProfileNavbar } from "@/components/profile";
import { fetchUserProfileDetailApi, fetchUserProfilePostsApi } from "@/redux-stores/slice/profile/api.service";
import { RootState } from "@/redux-stores/store";
import ErrorScreen from "@/components/error/page";
import { Loader, ThemedView } from "hyper-native-ui";
import { ProfileHeaderLoader } from "@/components/profile/ProfileHeader";

const AccountScreen = () => {
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const username = session?.username
    const isProfile = session?.username === username
    const [loading, setLoading] = useState<loadingType>('idle')
    const [error, setError] = useState<string | null>(null)
    const Posts = useRef<Post[]>([])
    const UserData = useRef<User | null>(null)
    const totalFetchedItemCount = useRef<number>(0)
    const dispatch = useDispatch()

    const fetchPosts = useCallback(async () => {
        if (loading === "pending" || totalFetchedItemCount.current === -1) return
        setLoading("pending")
        try {
            const res = await dispatch(fetchUserProfilePostsApi({
                username: UserData.current?.id,
                offset: totalFetchedItemCount.current,
                limit: 12
            }) as any) as disPatchResponse<Post[]>
            if (res.error) {
                ToastAndroid.show("Post Not Found", ToastAndroid.LONG)
                return
            }
            if (res.payload.length <= 0) {
                totalFetchedItemCount.current = -1
                return
            }
            Posts.current.push(...res.payload)
            totalFetchedItemCount.current += res.payload.length
        } finally {
            setLoading("normal")
        }
    }, [loading])

    const fetchUserData = useCallback(async () => {
        if (UserData.current || !username) return
        const res = await dispatch(fetchUserProfileDetailApi(username) as any) as disPatchResponse<User>
        if (res.error) {
            setError(res?.error?.message || "An error occurred")
            setLoading("normal")
            return
        }
        UserData.current = res.payload
        fetchPosts()
    }, [username])

    const onEndReached = useCallback(() => {
        if (totalFetchedItemCount.current < 10 || loading === "pending" || loading === "idle") return
        fetchPosts()
    }, [loading])

    const onRefresh = useCallback(() => {
        if (loading === "pending" || loading === "idle") return
        setLoading("pending")
        UserData.current = null
        Posts.current = []
        totalFetchedItemCount.current = 0
        fetchUserData()
    }, [loading])

    useEffect(() => {
        fetchUserData()
    }, [])

    if (error) return <ErrorScreen />

    return (
        <ThemedView style={{
            flex: 1,
            width: "100%",
            height: "100%"
        }}>
            <ProfileNavbar
                isProfile={isProfile} username={username || "No User"} />
            <FlatList
                data={Posts.current}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                bounces={false}
                bouncesZoom={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                refreshing={false}
                onEndReachedThreshold={0.5}
                removeClippedSubviews={true}
                windowSize={10}
                onEndReached={onEndReached}
                onRefresh={onRefresh}
                columnWrapperStyle={{
                    gap: 2,
                    paddingVertical: 1,
                }}
                renderItem={({ item, index }) => (<ProfileGridItem
                    item={item} index={index} />)}
                ListHeaderComponent={UserData.current ? <>
                    <ProfileHeader
                        userData={UserData.current}
                        isProfile={isProfile} />
                </> : <></>}
                ListFooterComponent={loading === "pending" || loading === "idle" ? <View style={{
                    width: '100%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Loader size={40} />
                </View> : <View style={{ height: totalFetchedItemCount.current === -1 ? 0 : 50 }} />}
                ListEmptyComponent={<ProfileEmptyPosts loading={loading} />}
            />
        </ThemedView>
    )
}

export default AccountScreen;