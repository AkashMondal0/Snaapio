import { memo, useCallback, useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "@/components/skysolo-ui"
import { NavigationProps, User } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
let totalFetchedItemCount = 0

const ProfileStories = ({
    navigation, userData, isProfile
}: {
    navigation: NavigationProps,
    userData?: User
    isProfile?: boolean
}) => {
    const stopRef = useRef(false)
    const getStoriesApi = useCallback(async (reset?: boolean) => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        try {
            // const res = await dispatch(fetchAccountFeedApi({
            //     limit: 12,
            //     offset: reset ? 0 : totalFetchedItemCount
            // }) as any) as disPatchResponse<Post[]>

            // if (res.payload.length > 0) {
            //     // if less than 12 items fetched, stop fetching
            //     if (res.payload.length < 12) {
            //         return totalFetchedItemCount = -1
            //     }
            //     // if more than 12 items fetched, continue fetching
            //     totalFetchedItemCount += res.payload.length
            // }
        } finally {
            stopRef.current = false
        }
    }, [])

    const onPress = useCallback((item: any) => {
    }, [])

    return (
        <View style={{
            width: '100%',
            paddingTop: 8,
        }}>
            <FlatList
                data={Array(100).fill(0)}
                renderItem={({ item }) => <StoriesItem data={item} onPress={onPress} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                scrollEventThrottle={16}
                ListHeaderComponent={<View style={{ width: 6 }} />}
                ListFooterComponent={<View style={{ width: 6 }} />}
                showsHorizontalScrollIndicator={false} />
        </View>)

}
export default ProfileStories;


const StoriesItem = memo(function StoriesItem({
    data, onPress
}: {
    data: any,
    onPress?: (item: any) => void
}) {
    const session = useSelector((state: RootState) => state.AuthState.session.user)

    return (<TouchableOpacity
        activeOpacity={0.9}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 110,
            height: 110,
            aspectRatio: 1,
        }}>
        <Avatar url={session?.profilePicture} size={80} />
        <Text variant="heading4" colorVariant="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {session?.username}
        </Text>
    </TouchableOpacity>)
}, () => true)