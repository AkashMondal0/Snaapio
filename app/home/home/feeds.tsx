import { Avatar, Image, Loader, Text } from '@/components/skysolo-ui';
import { FlashList } from '@shopify/flash-list';
import debounce from "@/lib/debouncing";
import { fetchAccountFeedApi } from "@/redux-stores/slice/account/api.service";
import { RootState } from "@/redux-stores/store";
import { Post, disPatchResponse } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { memo } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
let totalFetchedItemCount: number | null = 0
let pageLoaded = false

const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {
    const feedList = useSelector((state: RootState) => state.AccountState.feeds)
    const dispatch = useDispatch()
    const stopRef = useRef(false)

    const getPostApi = useCallback(async () => {
        if (totalFetchedItemCount === null) return
        try {
            const res = await dispatch(fetchAccountFeedApi({
                limit: 12,
                offset: totalFetchedItemCount
            }) as any) as disPatchResponse<Post[]>

            // console.log('fetching more posts', res.)
            if (res.payload.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload.length < 12) {
                    return totalFetchedItemCount = null
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount += 12
            }
        } finally {
            stopRef.current = false
        }
    }, [])

    const fetchPosts = debounce(getPostApi, 1000)

    useEffect(() => {
        if (!pageLoaded) {
            pageLoaded = true
            getPostApi()
        }
    }, [])

    return (
        <View style={{
            width: "100%",
            height: "100%",
        }}>
            <FlashList
                ListHeaderComponent={ListHeaderComponent}
                renderItem={({ item }) => <Item data={item} />}
                keyExtractor={(item, index) => index.toString()}
                scrollEventThrottle={400}
                estimatedItemSize={50}
                // onRefresh={() => {
                //     totalFetchedItemCount = 0
                //     fetchPosts()
                // }}
                // refreshing={true}
                // onEndReachedThreshold={0.1}
                // onEndReached={() => {
                //     console.log('end reached')
                //     if (!stopRef.current) {
                //         stopRef.current = true
                //         fetchPosts()
                //     }
                // }}
                data={feedList} />
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