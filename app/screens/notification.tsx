/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Loader, Text, TouchableOpacity, Image, ThemedView } from "@/components/skysolo-ui";
import { FlatList, ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppHeader from "@/components/AppHeader";
import { RootState } from "@/redux-stores/store";
import { Notification, disPatchResponse, NavigationProps, NotificationType } from "@/types";
import { fetchAccountNotificationApi } from "@/redux-stores/slice/notification/api.service";
import { resetNotificationState } from "@/redux-stores/slice/notification";
import { timeAgoFormat } from "@/lib/timeFormat";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
let totalFetchedItemCount = 0

const NotificationScreen = memo(function NotificationScreen({ navigation }: { navigation: NavigationProps }) {
    const notifications = useSelector((state: RootState) => state.NotificationState.notifications)
    const notificationsLoading = useSelector((state: RootState) => state.NotificationState.loading)
    const notificationsError = useSelector((state: RootState) => state.NotificationState.error)
    const stopRef = useRef(false)
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchAccountNotificationApi({
                limit: 12,
                offset: totalFetchedItemCount,
            }) as any) as disPatchResponse<Notification[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [])

    const onEndReached = useCallback(() => {
        if (stopRef.current || totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetNotificationState())
        fetchApi()
    }, [])

    useEffect(() => {
        onRefresh()
    }, [])

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Notifications" navigation={navigation} />
            <FlatList
                data={notifications}
                renderItem={({ item }) => (<NotificationItem data={item}
                    navigation={navigation}
                />)}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                refreshing={false}
                onRefresh={onRefresh}
                ListEmptyComponent={() => {
                    if (notificationsLoading === "idle") return <View />
                    if (notificationsError) return <ErrorScreen message={notificationsError} />
                    if (!notificationsError && notificationsLoading === "normal") return <ListEmpty text="No Notification yet" />
                }}
                ListFooterComponent={notificationsLoading === "pending" ? <Loader size={50} /> : <></>}
            />
        </ThemedView>
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
    const [readMore, setReadMore] = useState(false)

    return (<TouchableOpacity
        onPress={() => setReadMore(!readMore)}
        style={{
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
            width: '65%',
        }}>
            <Avatar url={data.author?.profilePicture} size={55} onPress={() => {
                if (!data.author?.username) return ToastAndroid.show('User not found', ToastAndroid.SHORT)
            }} />
            <View style={{}}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <Text numberOfLines={readMore ? 20 : 3} ellipsizeMode="tail">
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
        <Image url={data.post?.fileUrl[0].urls?.low}
            showImageError
            style={{
                width: 60,
                borderRadius: 10,
                aspectRatio: 1 / 1,
                flex: 0,
            }} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})