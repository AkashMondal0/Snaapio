import { memo, useCallback, useEffect, useRef } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Icon, Loader, View as ThemedView, Text } from "@/components/skysolo-ui";
import { AuthorData, disPatchResponse, NavigationProps, Session, User } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { StoriesItem } from "../home/story";
import { fetchUserHighlightApi } from "@/redux-stores/slice/profile/api.service";
let totalFetchedItemCount: number = 0;
const StoriesComponent = memo(function StoriesComponent({
    navigation,
    user,
    isProfile
}: {
    navigation: NavigationProps,
    user?: User | null,
    isProfile?: boolean
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
            if (!user?.id) return
            const res = await dispatch(fetchUserHighlightApi({
                limit: 12,
                offset: totalFetchedItemCount,
                id: user?.id
            }) as any) as disPatchResponse<AuthorData[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [])

    useEffect(() => {
        // fetchApi()
    }, [])

    const onEndReached = useCallback(() => {
        if (totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const navigateToHighlight = useCallback((item: AuthorData | Session) => {
        navigation.push('highlight', { user: item })
    }, [])

    const navigateToHighlightUpload = useCallback(() => {
        navigation.navigate('highlight/selection')
    }, [])

    return (
        <View style={{
            width: '100%',
            paddingTop: 8,
        }}>
            <FlatList
                data={[]}
                renderItem={({ item }) => <StoriesItem data={item} onPress={navigateToHighlight} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                scrollEventThrottle={16}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                bounces={false}
                ListFooterComponent={<View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{ width: 6 }} />
                    {isProfile ?
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={navigateToHighlightUpload}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 100,
                                height: 120,
                            }}>
                            <ThemedView
                                variant="secondary"
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 0.8,
                                    marginBottom: 4,
                                }}>
                                <Icon iconName="Plus" size={60}
                                    color="white"
                                    strokeWidth={1}
                                    onPress={navigateToHighlightUpload} />
                            </ThemedView>
                            <Text>Highlight</Text>
                        </TouchableOpacity> : <></>}
                </View>}
                ListHeaderComponent={<View style={{ width: 6 }} />}
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