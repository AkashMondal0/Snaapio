import { memo, useCallback, useEffect, useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Avatar, Icon, Loader, Text } from "@/components/skysolo-ui";
import { AuthorData, disPatchResponse, NavigationProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { fetchAccountStoryApi } from "@/redux-stores/slice/account/api.service";
let totalFetchedItemCount: number = 0;

const StoriesComponent = memo(function StoriesComponent({
    navigation
}: {
    navigation: NavigationProps,
}) {
    const storyList = useSelector((state: RootState) => state.AccountState.storyAvatars)
    const storyListLoading = useSelector((state: RootState) => state.AccountState.storyAvatarsLoading)
    const storyError = useSelector((state: RootState) => state.AccountState.storyAvatarsError)
    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchAccountStoryApi({
                limit: 12,
                offset: totalFetchedItemCount
            }) as any) as disPatchResponse<AuthorData[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [])

    useEffect(() => {
        fetchApi()
    }, [])

    const onEndReached = useCallback(() => {
        if (totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onPress = useCallback((item: any) => {
        navigation.push('story', { user: item })
    }, [])

    const navigateToStoriesUpload = useCallback(() => {
        navigation.navigate('story/selection')
    }, [])

    return (
        <View style={{
            width: '100%',
            paddingTop: 8,
        }}>
            <FlatList
                data={storyList}
                renderItem={({ item }) => <StoriesItem data={item} onPress={onPress} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                scrollEventThrottle={16}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                bounces={false}
                ListHeaderComponent={<View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{ width: 6 }} />
                    <AddStories onPress={onPress} addStory={navigateToStoriesUpload} />
                </View>}
                ListFooterComponent={<View style={{ width: 6 }} />}
                ListEmptyComponent={() => {
                    if (storyListLoading === "idle" || storyListLoading === "pending") {
                        return <View style={{
                            width: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 80,
                        }}>
                            <Loader size={40} />
                        </View>
                    }
                    if (storyError && storyListLoading === "normal") return <View />
                    return <View />
                }}
                showsHorizontalScrollIndicator={false} />
        </View>)

}, () => true)
export default StoriesComponent;


const StoriesItem = memo(function StoriesItem({
    data, onPress
}: {
    data: AuthorData,
    onPress?: (item: AuthorData) => void
}) {

    return (<TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress?.(data)}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 94,
            height: 120,
        }}>
        <Avatar
            isBorder
            url={data?.profilePicture} size={76}
            onPress={() => onPress?.(data)} />
        <Text variant="heading4" colorVariant="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {data?.username}
        </Text>
    </TouchableOpacity>)
}, () => true)

const AddStories = ({
    onPress,
    addStory
}: {
    onPress: (item: any) => void
    addStory: () => void
}) => {
    const session = useSelector((state: RootState) => state.AuthState.session.user)

    return (<TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress?.(session)}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 94,
            height: 120,
        }}>
        <View>
            <Avatar
                isBorder
                url={session?.profilePicture} size={76} onPress={() => onPress?.(session)} />
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 26,
                    height: 26,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Icon iconName="Plus" size={20} isButton variant="primary" onPress={addStory} />
            </View>
        </View>
        <Text variant="heading4" colorVariant="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {session?.username}
        </Text>
    </TouchableOpacity>)
}