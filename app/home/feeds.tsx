import { Loader } from '@/components/skysolo-ui';
import { FlashList } from '@shopify/flash-list';
import debounce from "@/lib/debouncing";
import { fetchAccountFeedApi } from "@/redux-stores/slice/account/api.service";
import { RootState } from "@/redux-stores/store";
import { NavigationProps, Post, disPatchResponse } from "@/types";
import React, { useCallback, useRef, memo, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { resetFeeds } from '@/redux-stores/slice/account';
import { FeedItem, HomeHeader } from '@/components/home';
import { resetComments, resetLike } from '@/redux-stores/slice/post';
let totalFetchedItemCount: number = 0

const FeedsScreen = memo(function FeedsScreen({ navigation }: { navigation: NavigationProps }) {
    const [finishedFetching, setFinishedFetching] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const stopRef = useRef(false)
    const feedList = useSelector((state: RootState) => state.AccountState.feeds)
    const feedListLoading = useSelector((state: RootState) => state.AccountState.feedsLoading)
    const dispatch = useDispatch()


    const getPostApi = useCallback(async (reset?: boolean) => {
        // console.log('fetching more posts', totalFetchedItemCount)
        if (stopRef.current) return
        if (totalFetchedItemCount === -1) return setFinishedFetching(true)
        try {
            const res = await dispatch(fetchAccountFeedApi({
                limit: 12,
                offset: reset ? 0 : totalFetchedItemCount
            }) as any) as disPatchResponse<Post[]>

            // console.log('fetching more posts', res.)
            if (res.payload.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload.length < 12) {
                    return totalFetchedItemCount = -1
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount += res.payload.length
            }
        } finally {
            stopRef.current = false
        }
    }, [])

    const fetchPosts = debounce(getPostApi, 1000)

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        totalFetchedItemCount = 0
        dispatch(resetFeeds())
        await getPostApi(true)
        setRefreshing(false)
    }, [])

    const onPress = useCallback((item: Post, path: "post/like" | "post/comment") => {
        if (path === "post/like") {
            dispatch(resetLike())
        } else if (path === "post/comment") {
            dispatch(resetComments())
        }
        navigation.navigate(path, { post: item })
    }, [])

    const onNavigate = useCallback((username: string) => {
        navigation.navigate("profile", { screen: 'profile', params: { username } });
    }, [])

    return (
        <View style={{
            width: "100%",
            height: "100%",
        }}>
            <FlashList
                data={feedList}
                ListHeaderComponent={() => <HomeHeader navigation={navigation} />}
                renderItem={({ item }) => <FeedItem data={item} onPress={onPress} onNavigate={onNavigate} />}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                onEndReached={fetchPosts}
                onEndReachedThreshold={0.5}
                bounces={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListFooterComponent={() => (
                    <View style={{ height: 50, padding: 10 }}>
                        {!finishedFetching || feedListLoading ? <Loader size={40} /> : <></>}
                    </View>)} />
        </View>
    )
})
export default FeedsScreen;
