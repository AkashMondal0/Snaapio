
import { Post } from "@/types";
import React, { useCallback, useRef, memo } from "react";
import { Animated, View } from "react-native";
import { HomeHeader } from '@/components/home';
import ErrorScreen from '@/components/error/page';
import ListEmpty from '@/components/ListEmpty';
import { Loader } from 'hyper-native-ui';
import { useGQArray } from "@/lib/useGraphqlQuery";
import { AQ } from "@/redux-stores/slice/account/account.queries";
import StoriesComponent from "@/components/home/story";
import { FeedItem, FeedItemLoader } from "@/components/post";

const FeedsScreen = memo(function FeedsScreen() {
    const { data, error, loadMoreData, loading, reload, requestCount } = useGQArray<Post>({
        query: AQ.feedTimelineConnection,
    });
    // animation 
    const scrollY = useRef(new Animated.Value(0));
    const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY.current } } }], { useNativeDriver: true });
    const diffClamp = (value: Animated.Value, lowerBound: number, upperBound: number) => {
        return Animated.diffClamp(value, lowerBound, upperBound);
    };
    const scrollYClamped = diffClamp(scrollY.current, 0, 130);
    const translateY = scrollYClamped.interpolate({
        inputRange: [0, 130],
        outputRange: [0, -(200 / 2)],
    });

    return (
        <View style={{
            flex: 1,
            width: "100%",
            height: "100%",
        }}>
            {useCallback(() => <HomeHeader translateY={translateY} />, [])()}
            <Animated.FlatList
                ListHeaderComponent={useCallback(() => <StoriesComponent />, [])}
                contentContainerStyle={{ paddingTop: 60 }}
                scrollEventThrottle={16}
                data={data}
                renderItem={({ item }) => <FeedItem data={item} />}
                keyExtractor={(item) => item?.id}
                onEndReachedThreshold={0.5}
                bounces={false}
                refreshing={false}
                removeClippedSubviews={true}
                onScroll={handleScroll}
                windowSize={16}
                onRefresh={reload}
                onEndReached={loadMoreData}
                ListEmptyComponent={() => {
                    if (error && loading === "normal") {
                        return <ErrorScreen message={error} />;
                    }
                    if (data.length <= 0 && loading === "normal") {
                        return <ListEmpty text="No feeds yet" />;
                    }
                    return <View />
                }}
                ListFooterComponent={() => {
                    if (loading !== "normal" && requestCount === 0) {
                        return <FeedItemLoader />;
                    }
                    if (loading === "pending") {
                        return <Loader size={50} />
                    }
                    return <View />;
                }}
            />
        </View>
    )
})
export default FeedsScreen;
