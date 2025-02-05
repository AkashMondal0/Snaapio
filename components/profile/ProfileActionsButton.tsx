import { memo, useState } from "react";
import { User, Conversation, disPatchResponse } from "@/types";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { createFriendshipApi, destroyFriendshipApi } from "@/redux-stores/slice/profile/api.service";
import { CreateConversationApi } from "@/redux-stores/slice/conversation/api.service";
import { setConversation } from "@/redux-stores/slice/conversation";
import { Button } from "hyper-native-ui";
import { useNavigation } from "@react-navigation/native";


const ProfileActionsButton = memo(function ProfileActionsButton({
    userData,
    isProfile,
    handleUnFollow,
    handleFollow,
}: {
    userData: User | null,
    isProfile: boolean
    handleUnFollow: () => void
    handleFollow: () => void
}) {
    const navigation = useNavigation();
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const isFollowing = userData?.friendship?.following
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleFollowApi = async () => {
        if (loading) return
        setLoading(true)
        try {
            if (!session?.id) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            if (!userData?.id) return ToastAndroid.show('User login issue', ToastAndroid.SHORT)
            const res = await createFriendshipApi({
                authorUserId: session?.id,
                authorUsername: session?.username,
                followingUserId: userData?.id,
                followingUsername: userData?.username,
            })
            if (!isProfile && res) {
                handleFollow()
            } else {
                ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            }
        }
        finally {
            setLoading(false)
        }
    }

    const handleUnFollowApi = async () => {
        if (loading) return
        setLoading(true)
        try {
            if (!session?.id) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            if (!userData?.id) return ToastAndroid.show('User login issue', ToastAndroid.SHORT)
            const res = await destroyFriendshipApi({
                authorUserId: session?.id,
                authorUsername: session?.username,
                followingUserId: userData?.id,
                followingUsername: userData?.username
            })
            if (!isProfile && res) {
                handleUnFollow()
            } else {
                ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            }
        } finally {
            setLoading(false)
        }
    }

    const messagePageNavigate = async () => {
        if (loading) return
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    if (isProfile) {
        return (<View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 20,
            gap: 10,
        }}>
            <Button
                onPress={() => navigation?.navigate("AccountEdit")} style={{
                    flex: 1,
                    height: 40
                }}>
                Edit Profile
            </Button>
            <Button style={{
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
            disabled={loading}
            onPress={isFollowing ? handleUnFollowApi : handleFollowApi}
            variant={isFollowing ? "secondary" : "default"}
            style={{
                flex: 1,
                height: 40
            }}>
            {isFollowing ? "Following" : "Follow"}
        </Button>
        <Button
            disabled={loading}
            onPress={messagePageNavigate}
            variant="secondary" style={{
                flex: 1,
                height: 40
            }}>
            Message
        </Button>
    </View>)
})
export default ProfileActionsButton;
