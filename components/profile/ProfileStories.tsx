import { memo, useCallback, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Icon, Text } from "@/components/skysolo-ui"
import { NavigationProps, User } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { useDispatch, useSelector } from "react-redux";
import debounce from "@/lib/debouncing";
import { RootState } from "@/redux-stores/store";
let totalFetchedItemCount = 0

const ProfileStories = ({

}: {
    navigation: NavigationProps,
    userData?: User
    isProfile?: boolean
}) => {

    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const getStoriesApi = useCallback(async (reset?: boolean) => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        // console.log('fetching more posts', totalFetchedItemCount)
        try {
            // const res = await dispatch(fetchAccountFeedApi({
            //     limit: 12,
            //     offset: reset ? 0 : totalFetchedItemCount
            // }) as any) as disPatchResponse<Post[]>

            // console.log('fetching more posts', res.)
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
        // navigation.navigate('Story', { story: item })
    }, [])

    return (
        <View style={{ marginVertical: 16 }}>
            <FlashList
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                renderItem={({ item }) => <StoriesItem data={item} onPress={onPress} />}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={50}
                horizontal
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
        activeOpacity={0.8}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 94,
        }}>
        <Avatar source={{ uri: session?.profilePicture }} size={70} />
        <Text variant="heading4" colorVariant="secondary"
            style={{ paddingHorizontal: 4, marginTop: 4 }}
            numberOfLines={1}>
            akashakashakashakash
        </Text>
    </TouchableOpacity>)
})