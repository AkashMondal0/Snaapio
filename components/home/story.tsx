import { memo, useCallback, useEffect } from "react";
import { FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { fetchAccountStoryApi } from "@/redux-stores/slice/account/api.service";
import { AuthorData, Session } from "@/types";
import { useTheme, Text } from 'hyper-native-ui';
import { StackActions, useNavigation } from "@react-navigation/native";
import { useGQArray } from "@/lib/useGraphqlQuery";
import { AQ } from "@/redux-stores/slice/account/account.queries";
const ITEM_HEIGHT = 120;

const StoriesComponent = memo(function StoriesComponent() {
    const navigation = useNavigation();
    const { data, error, loadMoreData, loading } = useGQArray<AuthorData>({
        query: AQ.storyTimelineConnection,
    });

    const onPress = useCallback((item: AuthorData | Session) => {
        navigation.dispatch(StackActions.push("Story", { user: item }));
    }, [])

    const navigateToStoriesUpload = useCallback(() => {
        navigation.navigate("SelectStory")
    }, [])

    return (
        <View style={{
            width: '100%',
            paddingTop: StatusBar.currentHeight
        }}>
            <FlatList
                data={data}
                renderItem={({ item }) => <StoriesItem data={item} onPress={onPress} />}
                keyExtractor={(item) => item.id}
                horizontal
                scrollEventThrottle={16}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                bounces={false}
                removeClippedSubviews={true}
                windowSize={12}
                getItemLayout={(data, index) => ({
                    index,
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index
                })}
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
                    if (loading === "idle" || loading === "pending") {
                        return <StoryLoader />
                    }
                    if (error && loading === "normal") return <View />
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
                        width: 30,
                        aspectRatio: 1,
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