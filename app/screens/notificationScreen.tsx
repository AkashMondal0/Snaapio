import { memo, useCallback, useRef } from "react";
import AppHeader from "@/components/AppHeader";
import { ListEmptyComponent } from "@/components/home";
import { Avatar, Loader, Text, TouchableOpacity } from "@/components/skysolo-ui";
import debounce from "@/lib/debouncing";
import { RootState } from "@/redux-stores/store";
import { Notification, disPatchResponse, NavigationProps, Post, NotificationType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountNotificationApi } from "@/redux-stores/slice/notification/api.service";
import { resetNotificationState } from "@/redux-stores/slice/notification";
import { timeAgoFormat } from "@/lib/timeFormat";
let totalFetchedItemCount = 0

interface NotificationScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            post: Post
        }
    }
}


const NotificationScreen = memo(function NotificationScreen({ navigation, route }: NotificationScreenProps) {
    const allNotifications = useSelector((state: RootState) => state.NotificationState.notifications)
    const notificationsLoading = useSelector((state: RootState) => state.NotificationState.loading)
    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const fetchNotificationApi = useCallback(async (reset?: boolean) => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        try {
            const res = await dispatch(fetchAccountNotificationApi({
                limit: 12,
                offset: reset ? 0 : totalFetchedItemCount,
            }) as any) as disPatchResponse<Notification[]>

            if (res.payload?.length > 0) {
                // if less than 12 items fetched, stop fetching
                if (res.payload?.length < 12) {
                    return totalFetchedItemCount = -1
                }
                // if more than 12 items fetched, continue fetching
                totalFetchedItemCount += res.payload.length
            }
        } finally {
            stopRef.current = false
        }
    }, [route?.params?.post?.id])

    const fetchNotifications = debounce(fetchNotificationApi, 1000)

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetNotificationState())
        fetchNotificationApi(true)
    }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Notifications" navigation={navigation} />
            <FlashList
                data={allNotifications}
                renderItem={({ item }) => (<NotificationItem data={item}
                    navigation={navigation}
                />)}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => <>{notificationsLoading ? <Loader size={50} /> : <></>}</>}
                ListEmptyComponent={!notificationsLoading ? <ListEmptyComponent text="No Notifications yet" /> : <></>}
                estimatedItemSize={100}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={fetchNotifications}
                refreshing={false}
                scrollEventThrottle={16}
                onRefresh={onRefresh} />
        </View>
    )
})
export default NotificationScreen;

const NotificationItem = memo(function NotificationItem({
    data,
    navigation
}: {
    data: Notification,
    navigation: NavigationProps
}) {

    return (<TouchableOpacity style={{
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        width: '100%',
        gap: 10,
        marginVertical: 2,
        justifyContent: 'space-between',
    }}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            flex: 1,
        }}>
            <Avatar url={data.author?.profilePicture} size={55} onPress={() => {
                if (!data.author?.username) return ToastAndroid.show('User not found', ToastAndroid.SHORT)
            }} />
            <View style={{
                width: '85%',
            }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <Text numberOfLines={4} ellipsizeMode="tail">
                        <Text variant="heading3" lineBreakMode="clip" numberOfLines={2}>
                            {data.author?.username} {' '}
                        </Text>
                        <Text variant="heading4" colorVariant="secondary" lineBreakMode="tail" numberOfLines={2}>
                            {data.type === NotificationType.Like ? 'liked your post' : data.type === NotificationType.Comment ? 'commented on your post: ' : 'followed you'}
                        </Text>
                        <Text variant="heading4" colorVariant="secondary" numberOfLines={2} ellipsizeMode="tail">
                            {data?.comment?.content}
                        </Text>
                    </Text>
                </View>
                <Text variant="heading4" colorVariant="secondary">
                    {timeAgoFormat(data?.createdAt)}
                </Text>
            </View>
        </View>
        <Avatar url={data.post?.fileUrl[0]} size={60} style={{
            borderRadius: 10,
        }} onPress={() => {
            if (!data.post?.id) return ToastAndroid.show('Post not found', ToastAndroid.SHORT)
            ToastAndroid.show('Feature Coming Soon', ToastAndroid.SHORT)
            // navigation.navigate("post", { screen: 'post', params: { post: data.post } })
        }} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})