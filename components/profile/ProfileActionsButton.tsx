import { memo, useCallback, useRef } from "react";
import { User, Conversation, disPatchResponse, NavigationProps } from "@/types";
import { ToastAndroid, View } from "react-native";
import { Button } from "@/components/skysolo-ui"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { followUser, unFollowUser } from "@/redux-stores/slice/profile";
import { createFriendshipApi, destroyFriendshipApi } from "@/redux-stores/slice/profile/api.service";
import { CreateConversationApi } from "@/redux-stores/slice/conversation/api.service";
import { setConversation } from "@/redux-stores/slice/conversation";


const ProfileActionsButton = memo(function ProfileActionsButton({
    navigation,
    userData,
    isProfile
}: {
    navigation: NavigationProps,
    userData: User | null,
    isProfile: boolean
}) {

    const isFollowing = useSelector((Root: RootState) => Root.ProfileState.state?.friendship.following)
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const loadingRef = useRef(false)
    const dispatch = useDispatch()

    const handleFollow = useCallback(async () => {
        if (loadingRef.current) return
        loadingRef.current = true
        try {
            if (!session?.id) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            if (!userData?.id) return ToastAndroid.show('User login issue', ToastAndroid.SHORT)
            const res = await dispatch(createFriendshipApi({
                authorUserId: session?.id,
                authorUsername: session?.username,
                followingUserId: userData?.id,
                followingUsername: userData?.username,
            }) as any) as disPatchResponse<any>
            if (!isProfile && res.payload) {
                dispatch(followUser())
            } else {
                ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            }
        }
        finally {
            loadingRef.current = false
        }
    }, [isProfile, session?.id, userData?.id])

    const handleUnFollow = useCallback(async () => {
        if (loadingRef.current) return
        loadingRef.current = true
        try {
            if (!session?.id) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            if (!userData?.id) return ToastAndroid.show('User login issue', ToastAndroid.SHORT)
            const res = await dispatch(destroyFriendshipApi({
                authorUserId: session?.id,
                authorUsername: session?.username,
                followingUserId: userData?.id,
                followingUsername: userData?.username
            }) as any) as disPatchResponse<any>
            if (!isProfile && res.payload) {
                dispatch(unFollowUser())
            } else {
                ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            }
        } finally {
            loadingRef.current = false
        }
    }, [isProfile, session?.id, userData?.id])

    const messagePageNavigate = useCallback(async () => {
        if (loadingRef.current) return
        loadingRef.current = true
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
            navigation?.navigate("message/conversation", { id: res.payload.id })
        } catch (error) {
            ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
        } finally {
            loadingRef.current = false
        }
    }, [isProfile, session?.id, userData?.id])

    if (isProfile) {
        return (<View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 20,
            gap: 10,
        }}>
            <Button
                // onPress={() => navigation?.navigate('profile/edit')}
                size="auto"
                variant="secondary" style={{
                    flex: 1,
                    height: 40
                }}>
                Edit Profile
            </Button>
            <Button
                // onPress={() => navigation?.navigate('profile/share')}
                size="auto"
                variant="secondary" style={{
                    flex: 1,
                    height: 40
                }}>
                Share Profile
            </Button>
        </View>)
    }
    return (<View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        gap: 10,
    }}>
        <Button
            onPress={isFollowing ? handleUnFollow : handleFollow}
            size="auto"
            variant={isFollowing ? "secondary" : "default"}
            style={{
                flex: 1,
                height: 40
            }}>
            {isFollowing ? "Following" : "Follow"}
        </Button>
        <Button
            onPress={messagePageNavigate}
            size="auto"
            variant="secondary" style={{
                flex: 1,
                height: 40
            }}>
            Message
        </Button>
    </View>)
})
export default ProfileActionsButton;
