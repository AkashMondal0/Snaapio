import { FlashList } from '@shopify/flash-list';
import feedList from "@/data/feedlist.json"
import { memo, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Post } from '@/types';
import { Avatar, Image, Text } from '@/components/skysolo-ui';
import { useDispatch } from 'react-redux';
import { tabSwipeEnabled } from '@/redux-stores/slice/theme';
import debouncing from '@/lib/debouncing';



const FeedList = memo(function FeedList() {
    const dispatch = useDispatch()
    const stopRef = useRef(false)

    const delayFunc = () => {
        stopRef.current = false
        dispatch(tabSwipeEnabled(true))
    }

    const debouncingFunc = useMemo(() => debouncing(delayFunc, 500), [])

    const list: Post[] = [...feedList] as any

    return <View style={{
        width: "100%",
        height: "100%",
        paddingHorizontal: 5
    }}>
        <FlashList
            onScroll={(e) => {
                debouncingFunc()
                if (stopRef.current) return
                stopRef.current = true
                dispatch(tabSwipeEnabled(false))
            }}
            renderItem={({ item }) => <Item data={item} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={400}
            estimatedItemSize={10}
            data={list} />
    </View>
})

export default FeedList

const Item = memo(function ({ data }: { data: Post }) {

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