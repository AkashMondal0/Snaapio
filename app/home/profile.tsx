import { ProfileHeader, ProfileNavbar, ProfileStories } from "@/components/profile";
import { Image, Loader } from "@/components/skysolo-ui";
import debounce from "@/lib/debouncing";
import { resetProfileState } from "@/redux-stores/slice/profile";
// import debounce from "@/lib/debouncing";
import { fetchUserProfileDetailApi, fetchUserProfilePostsApi } from "@/redux-stores/slice/profile/api.service";
import { RootState } from "@/redux-stores/store";
import { AuthorData, disPatchResponse, NavigationProps, Post } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
let totalFetchedItemCount: number = 0
interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            params: { username: string }
        }
    }
}
const ProfileScreen = ({ navigation, route }: ScreenProps) => {
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const userData = useSelector((state: RootState) => state.ProfileState.state)
    const userDataLoading = useSelector((state: RootState) => state.ProfileState.loading)
    const postsLoading = useSelector((state: RootState) => state.ProfileState.postLoading)
    const username = useMemo(() => route.params.params.username, [route.params.params.username])
    const isProfile = useMemo(() => session?.username === username, [username])
    const [pageLoading, setPageLoading] = useState(true)
    const userPost = useSelector((state: RootState) => state.ProfileState.posts)
    const itemCount = useMemo(() => Math.ceil(userPost.length / 3), [userPost.length])
    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const fetchProfilePosts = useCallback(async (userId?: string, reset?: boolean) => {
        // console.log('fetching profile posts', totalFetchedItemCount)
        if (stopRef.current || totalFetchedItemCount === -1 || !userId) return
        try {
            const res = await dispatch(fetchUserProfilePostsApi({
                username: userId,
                limit: 12,
                offset: reset ? 0 : totalFetchedItemCount
            }) as any) as disPatchResponse<Post[]>
            if (res.payload?.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload?.length < 12) {
                    return totalFetchedItemCount = -1
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount += res.payload.length
            }
        } finally {
            stopRef.current = false
            if (pageLoading) setPageLoading(false)
        }
    }, [])

    const fetchProfileData = useCallback(async () => {
        if (stopRef.current) return
        if (!username) return console.warn('No username provided')
        const res = await dispatch(fetchUserProfileDetailApi(username) as any) as disPatchResponse<AuthorData>
        if (res.error || !res.payload.id) return console.warn('Error fetching profile data')
        totalFetchedItemCount = 0
        fetchProfilePosts(res.payload.id, false)
    }, [username])

    const delayFetchProfilePosts = debounce(fetchProfilePosts, 1000)

    // const navigateToPost = useCallback((item: Post) => {
    //     navigation.navigate('Post', { post: item.id })
    // }, [])

    useEffect(() => {
        dispatch(resetProfileState())
        fetchProfileData()
    }, [username])

    return (
        <View style={{
            width: '100%',
            height: '100%',
        }}>
            <ProfileNavbar navigation={navigation} isProfile={isProfile} username={username} />
            <FlashList
                ListHeaderComponent={pageLoading || userDataLoading ? <></> : <>
                    <ProfileHeader
                        navigation={navigation}
                        userData={userData}
                        isProfile={isProfile} />
                    <ProfileStories navigation={navigation} />
                </>}
                data={pageLoading || userDataLoading ? [] : Array.from({ length: itemCount }, (_, i) => i)}
                estimatedItemSize={100}
                bounces={false}
                onEndReachedThreshold={0.5}
                refreshing={false}
                onRefresh={fetchProfileData}
                onEndReached={() => delayFetchProfilePosts(userData?.id)}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<></>}
                ListFooterComponent={() => <>{postsLoading ? <View style={{
                    width: '100%',
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Loader size={40} />
                </View> : <></>}</>}
                renderItem={({ index }) => <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    gap: 3,
                    paddingVertical: 1.5,
                }}>
                    {Array(3).fill(0).map((_, i) => {
                        if (!userPost[index * 3 + i]) return <View
                            key={index * 3 + i}
                            style={{
                                width: '33.33%',
                                height: "100%",
                                aspectRatio: 1
                            }} />
                        return <Image
                            showImageError
                            key={userPost[index * 3 + i]?.id}
                            url={userPost[index * 3 + i]?.fileUrl[0]}
                            style={{
                                width: '33.33%',
                                height: "100%",
                                aspectRatio: 1,
                                borderRadius: 0,
                            }}
                        />
                    })}
                </View>} />
        </View>
    )
}

export default ProfileScreen;