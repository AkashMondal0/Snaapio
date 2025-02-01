import React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Icon, Avatar } from "@/components/skysolo-ui";
import { disPatchResponse, loadingType, User, Highlight } from "@/types";
import { useDispatch } from "react-redux";
import { fetchUserHighlightApi } from "@/redux-stores/slice/profile/api.service";
import { Text, Loader, ThemedView, Skeleton } from "hyper-native-ui"
import { StackActions, useNavigation } from "@react-navigation/native";

const StoriesComponent = memo(function StoriesComponent({
    user,
    isProfile
}: {
    user?: User | null,
    isProfile?: boolean
}) {
    const navigation = useNavigation();

    const [state, setState] = useState<{
        loading: loadingType,
        error: boolean,
        data: Highlight[]
    }>({
        data: [],
        error: false,
        loading: "idle",
    })
    const totalFetchedItemCount = useRef(0)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: "pending" }))
        if (totalFetchedItemCount.current === -1) return
        if (!user?.id) return ToastAndroid.show("User id not found", ToastAndroid.SHORT)
        const res = await dispatch(fetchUserHighlightApi({
            limit: 12,
            offset: totalFetchedItemCount.current,
            id: user?.id
        }) as any) as disPatchResponse<Highlight[]>
        if (res.error) {
            totalFetchedItemCount.current = -1
            setState((prev) => ({ ...prev, loading: "normal", error: true }))
            return
        }
        setState((prev) => ({
            ...prev,
            loading: "normal",
            data: [...prev.data, ...res.payload]
        }))
        if (res.payload.length >= 12) {
            totalFetchedItemCount.current += res.payload.length
            return
        }
        totalFetchedItemCount.current = -1
    }, [user?.id, totalFetchedItemCount.current])

    useEffect(() => {
        fetchApi()
    }, [])

    const onEndReached = useCallback(() => {
        if (totalFetchedItemCount.current < 10 || state.loading === "pending") return
        fetchApi()
    }, [state.loading, totalFetchedItemCount.current])

    const navigateToHighlight = useCallback((item: Highlight) => {
        navigation.dispatch(StackActions.push("Highlight" as any, {
            user: user,
            highlight: item
        }));
    }, [user])

    const navigateToHighlightUpload = useCallback(() => {
        navigation.navigate("HighlightSelect")
    }, [])

    return (
        <View style={{
            width: '100%',
            paddingTop: 8,
        }}>
            <FlatList
                data={state.data}
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
                                style={{
                                    width: 84,
                                    aspectRatio: 1 / 1,
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 2,
                                    marginBottom: 4,
                                }}>
                                <Icon
                                    iconName="Plus"
                                    size={60}
                                    variant="secondary"
                                    iconColorVariant="secondary"
                                    strokeWidth={1}
                                    onPress={navigateToHighlightUpload} />
                            </ThemedView>
                            <Text variantColor="secondary">Highlight</Text>
                        </TouchableOpacity> : <></>}
                </View>}
                ListHeaderComponent={<View style={{ width: 6 }} />}
                ListEmptyComponent={() => {
                    if (state.loading === "idle" || state.loading === "pending") {
                        return <StoryLoader />
                    }
                    if (state.error && state.loading === "normal") return <View />
                    return <View />
                }}
                showsHorizontalScrollIndicator={false} />
        </View>)

}, (pre, next) => pre.user?.id === next.user?.id)
export default StoriesComponent;

export const StoriesItem = memo(function StoriesItem({
    data, onPress
}: {
    data: Highlight,
    onPress?: (item: Highlight) => void
}) {
    if (!data || !data.stories || !data.stories[0]?.fileUrl) return <></>
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
            size={80}
            borderColorVariant="secondary"
            url={data?.stories[0]?.fileUrl[0] ? data?.stories[0].fileUrl[0].urls?.high : null}
            onPress={() => onPress?.(data)} />
        <Text variantColor="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {data?.content}
        </Text>
    </TouchableOpacity>)
}, () => true)


const StoryLoader = () => {
    return <View style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        height: 90,
        alignItems: "center"
    }}>
        {Array(10).fill(0).map((_, i) => <Skeleton key={i} width={80} height={80} borderRadius={160} />)}
    </View>
}