import { memo, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Avatar, Icon, Loader, Text } from "@/components/skysolo-ui";
import { AuthorData, disPatchResponse, loadingType, NavigationProps, Session, Story } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { fetchAccountStoryApi, fetchStoryApi } from "@/redux-stores/slice/account/api.service";
let totalFetchedItemCount: number = 0;
let authorStory: boolean = false;
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

    const onPress = useCallback((item: AuthorData | Session) => {
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
            width: 100,
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
    const [state, setState] = useState<{
        loading: loadingType,
        error: boolean,
        data: Story[]
    }>({
        data: [],
        error: false,
        loading: "idle",
    })
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        if (!session?.id) return
        const res = await dispatch(fetchStoryApi(session?.id) as any) as disPatchResponse<any[]>
        if (res.error) return setState({ ...state, loading: "normal", error: true })
        if (res.payload.length > 0) {
            setState({
                ...state,
                loading: "normal",
                data: res.payload,
            })
            return
        }
        setState({ ...state, loading: "normal", error: true })
    }, [session?.id])

    useEffect(() => {
        if (!authorStory) {
            if (state.data.length > 0) {
                authorStory = true
                return
            }
            fetchApi()
        }
    }, [state.data.length])

    const onClickAvatar = useCallback(() => {
        if (state.data.length > 0) {
            onPress?.(session)
            return
        }
        addStory()
    }, [session, state.data.length])

    return (<TouchableOpacity
        activeOpacity={0.9}
        onPress={onClickAvatar}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 120,
        }}>
        <View>
            <Avatar
                isBorder
                url={session?.profilePicture} size={76} onPress={onClickAvatar} />
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