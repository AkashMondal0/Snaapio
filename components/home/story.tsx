import { memo, useCallback, useEffect, useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { fetchAccountStoryTimelineApi, fetchAccountStoryApi } from "@/redux-stores/slice/account/api.service";
import { AuthorData, Session } from "@/types";
import { useTheme, Text, Skeleton } from 'hyper-native-ui';
import { StackActions, useNavigation } from "@react-navigation/native";

const StoriesComponent = memo(function StoriesComponent() {
    const navigation = useNavigation();
    const storyList = useSelector((state: RootState) => state.AccountState.storyAvatars)
    const storyListLoading = useSelector((state: RootState) => state.AccountState.storyAvatarsLoading)
    const storyError = useSelector((state: RootState) => state.AccountState.storyAvatarsError)
    const totalFetchedItemCount = useSelector((state: RootState) => state.AccountState.storiesFetchedItemCount)
    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            await dispatch(fetchAccountStoryTimelineApi({
                limit: 12,
                offset: totalFetchedItemCount
            }) as any)
        } finally {
            stopRef.current = false
        }
    }, [totalFetchedItemCount])

    useEffect(() => {
        fetchApi()
    }, [])

    const onEndReached = useCallback(() => {
        if (totalFetchedItemCount < 10) return
        fetchApi()
    }, [totalFetchedItemCount])

    const onPress = useCallback((item: AuthorData | Session) => {
        // navigation.navigate("Story", { user: item }) 
        navigation.dispatch(StackActions.push("Story", { user: item }));
    }, [])

    const navigateToStoriesUpload = useCallback(() => {
        navigation.navigate("SelectStory")
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
                        return <StoryLoader />
                    }
                    if (storyError && storyListLoading === "normal") return <View />
                    return <View />
                }}
                showsHorizontalScrollIndicator={false} />
        </View>)

}, () => true)
export default StoriesComponent;


export const StoriesItem = memo(function StoriesItem({
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
        <Text variantColor="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {data?.username}
        </Text>
    </TouchableOpacity>)
}, () => true)

export const AddStories = ({
    onPress,
    addStory
}: {
    onPress: (item: any) => void
    addStory: () => void
}) => {
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const data = useSelector((state: RootState) => state.AccountState.accountStories)
    const { currentTheme } = useTheme();

    const dispatch = useDispatch()
    const userActiveStory = data.length > 0

    const fetchApi = useCallback(async () => {
        if (!session?.id) return
        await dispatch(fetchAccountStoryApi(session?.id) as any)
    }, [session?.id])

    useEffect(() => {
        fetchApi()
    }, [session?.id])

    const onClickAvatar = useCallback(() => {
        if (userActiveStory) {
            onPress?.(session)
            return
        }
        addStory()
    }, [session, userActiveStory])

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
                isBorder={userActiveStory}
                size={76}
                url={session?.profilePicture}
                onPress={onClickAvatar} />
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
                <Icon iconName="Plus" size={20}
                    style={{
                        borderWidth: 2,
                        borderColor: currentTheme?.background,
                    }}
                    isButton variant="primary" onPress={addStory} />
            </View>
        </View>
        <Text variantColor="secondary" style={{ padding: 4 }} numberOfLines={1}>
            Add Story
        </Text>
    </TouchableOpacity>)
}

const StoryLoader = () => {
    const { currentTheme } = useTheme();
    return <View style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        height: 90,
        alignItems: "center"
    }}>
        {Array(10).fill(0).map((_, i) => <View key={i}
            style={{
                width: 80,
                height: 80,
                borderRadius: 180,
                backgroundColor: currentTheme.input
            }}
        />)}
    </View>
}