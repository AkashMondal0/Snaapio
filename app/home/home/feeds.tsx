import { Avatar, Image, Loader, Text } from '@/components/skysolo-ui';
import { FlashList } from '@shopify/flash-list';
import debounce from "@/lib/debouncing";
import { fetchAccountFeedApi } from "@/redux-stores/slice/account/api.service";
import { RootState } from "@/redux-stores/store";
import { Post, disPatchResponse } from "@/types";
import React, { useCallback, useRef, memo, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { resetFeeds } from '@/redux-stores/slice/account';
let totalFetchedItemCount: number = 0

const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {
    const [finishedFetching, setFinishedFetching] = useState(false)
    const stopRef = useRef(false)
    const dispatch = useDispatch()
    const feedList = useSelector((state: RootState) => state.AccountState.feeds)
    const feedListLoading = useSelector((state: RootState) => state.AccountState.feedsLoading)
    const [refreshing, setRefreshing] = useState(false)


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
        await getPostApi(false)
        setRefreshing(false)
    }, [])

    return (
        <View style={{
            width: "100%",
            height: "100%",
        }}>
            <FlashList
                data={feedList}
                ListHeaderComponent={ListHeaderComponent}
                renderItem={({ item }) => <Item data={item} />}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                onEndReached={fetchPosts}
                onEndReachedThreshold={0.5}
                bounces={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListFooterComponent={() => (
                    <View style={{ height: 50, padding: 10 }}>
                        {!finishedFetching || feedListLoading ? <Loader size={40} /> : <Text variant="heading4" style={{ textAlign: "center" }}>
                            No more posts
                        </Text>}
                    </View>)} />
        </View>
    )
})
export default FeedsScreen;



const Item = memo(function Item({ data }: { data: Post }) {

    return <View style={{
        width: "100%",
        paddingVertical: 10,
    }}>
        <View style={{
            width: "100%",
            paddingVertical: 10,
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <Avatar
                size={45}
                url={data.user?.profilePicture} />
            <View>
                <Text
                    style={{ fontWeight: "600" }}
                    variant="heading3">
                    {data?.user?.name}
                </Text>
                <Text
                    style={{ fontWeight: "300" }}
                    variant="heading4">
                    {data?.content ?? "new chat"}
                </Text>
            </View>
        </View>
        <Image src={data.fileUrl[0]} style={{
            width: "100%",
            height: 560
        }} />
    </View>
}, (prev, next) => {
    return prev.data.id === next.data.id
})

const ListHeaderComponent = () => {
    return <View>
        <Text variant="heading2" style={{
            fontWeight: "700",
            padding: 10,
            paddingVertical: 14
        }}>SkyLight</Text>
    </View>
}