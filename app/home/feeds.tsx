/* eslint-disable react-hooks/exhaustive-deps */
import { fetchAccountFeedApi } from "@/redux-stores/slice/account/api.service";
import { RootState } from "@/redux-stores/store";
import { NavigationProps, Post, disPatchResponse } from "@/types";
import React, { useCallback, useRef, memo, useEffect } from "react";
import { Animated, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { resetFeeds } from '@/redux-stores/slice/account';
import { FeedItem, HomeHeader } from '@/components/home';
import { ProfileStories } from '@/components/profile';
import ErrorScreen from '@/components/error/page';
import ListEmpty from '@/components/ListEmpty';
import { Loader, ThemedView } from '@/components/skysolo-ui';
let totalFetchedItemCount: number = 0

const FeedsScreen = memo(function FeedsScreen({ navigation }: { navigation: NavigationProps }) {
    const feedList = useSelector((state: RootState) => state.AccountState.feeds)
    const feedListLoading = useSelector((state: RootState) => state.AccountState.feedsLoading)
    const feedsError = useSelector((state: RootState) => state.AccountState.feedsError)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
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
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
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

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetFeeds())
        fetchApi()
    }, [])

    return (
        <ThemedView style={{
            flex: 1,
            width: "100%",
            height: "100%",
        }}>
            <HomeHeader navigation={navigation} translateY={translateY} />
            <Animated.FlatList
                ListHeaderComponent={ProfileStories}
                contentContainerStyle={{ paddingTop: 60 }}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                windowSize={12}
                data={feedList}
                renderItem={({ item }) => <FeedItem data={item} navigation={navigation} />}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                bounces={false}
                refreshing={false}
                onRefresh={onRefresh}
                onScroll={handleScroll}
                ListEmptyComponent={() => {
                    if (feedListLoading === "idle") return <View />
                    if (feedsError) return <ErrorScreen message={feedsError} />
                    if (!feedsError && feedListLoading === "normal") return <ListEmpty text="No feeds available" />
                }}
                ListFooterComponent={() => feedListLoading === "pending" ? <Loader size={40} /> : <></>}
            />
        </ThemedView>
    )
})
export default FeedsScreen;
