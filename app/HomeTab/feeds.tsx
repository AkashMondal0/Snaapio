import { fetchAccountFeedApi, fetchAccountStoryTimelineApi, fetchStoryApi } from "@/redux-stores/slice/account/api.service";
import { RootState } from "@/redux-stores/store";
import { Post, disPatchResponse } from "@/types";
import React, { useCallback, useRef, memo, useEffect } from "react";
import { Animated, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { resetFeeds } from '@/redux-stores/slice/account';
import { FeedItem, HomeHeader } from '@/components/home';
import ErrorScreen from '@/components/error/page';
import ListEmpty from '@/components/ListEmpty';
import { Loader } from 'hyper-native-ui';
import StoriesComponent from "@/components/home/story";
import { FeedLoader } from "@/components/home/feedListItem";
let totalFetchedItemCount: number = 0;

const FeedsScreen = memo(function FeedsScreen() {
    const feedList = useSelector((state: RootState) => state.AccountState.feeds);
    const feedListLoading = useSelector((state: RootState) => state.AccountState.feedsLoading);
    const feedsError = useSelector((state: RootState) => state.AccountState.feedsError);
    const session = useSelector((state: RootState) => state.AuthState.session.user);
    const stopRef = useRef(false);
    const dispatch = useDispatch();
    // animation 
    const scrollY = useRef(new Animated.Value(0));
    const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY.current } } }], { useNativeDriver: true });
    const diffClamp = (value: Animated.Value, lowerBound: number, upperBound: number) => {
        return Animated.diffClamp(value, lowerBound, upperBound);
    };
    const scrollYClamped = diffClamp(scrollY.current, 0, 130);
    const translateY = scrollYClamped.interpolate({
        inputRange: [0, 130],
        outputRange: [0, -(130 / 2)],
    });

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return;
        stopRef.current = true;
        try {
            const res = await dispatch(fetchAccountFeedApi({
                limit: 12,
                offset: totalFetchedItemCount
            }) as any) as disPatchResponse<Post[]>
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
        if (stopRef.current || totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onRefresh = useCallback(async () => {
        totalFetchedItemCount = 0
        dispatch(resetFeeds())
        fetchApi()
        await dispatch(fetchAccountStoryTimelineApi({
            limit: 12,
            offset: 0
        }) as any)
        if (session?.id) {
            await dispatch(fetchStoryApi(session?.id) as any)
        }
    }, [session?.id]);

    const keyExtractor = useCallback((item: any, index: number) => index.toString(), []);
    const itemRender = useCallback(({ item }: any) => <FeedItem data={item} />, []);
    const ListHeaderComponent = useCallback(() => <StoriesComponent />, []);
    const ListEmptyComponent = useCallback(() => {
        if (feedListLoading === "idle" || feedListLoading === "pending") {
            return <FeedLoader />
        }
        if (feedsError) return <ErrorScreen message={feedsError} />
        if (!feedsError && feedListLoading === "normal") return <ListEmpty text="No feeds available" />
    }, [feedListLoading, feedsError])
    const ListFooterComponent = useCallback(() => feedListLoading === "pending" ? <Loader size={40} /> : <></>, [feedListLoading])
    const HeaderComponent = useCallback(() => <HomeHeader translateY={translateY} />, [translateY])
    return (
        <View style={{
            flex: 1,
            width: "100%",
            height: "100%",
        }}>
            <HeaderComponent />
            <Animated.FlatList
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={{ paddingTop: 60 }}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                windowSize={12}
                data={feedList}
                renderItem={itemRender}
                keyExtractor={keyExtractor}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                bounces={false}
                refreshing={false}
                onRefresh={onRefresh}
                onScroll={handleScroll}
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={ListFooterComponent}
            />
        </View>
    )
})
export default FeedsScreen;

