/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Image } from "@/components/skysolo-ui";
import { FlatList, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppHeader from "@/components/AppHeader";
import { RootState } from "@/redux-stores/store";
import { Notification, disPatchResponse, NotificationType } from "@/types";
import { fetchAccountNotificationApi } from "@/redux-stores/slice/notification/api.service";
import { resetNotificationState } from "@/redux-stores/slice/notification";
import { timeAgoFormat } from "@/lib/timeFormat";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import { ThemedView, Loader, Text, TouchableOpacity, useTheme, } from "hyper-native-ui";
import { useNavigation } from "@react-navigation/native";
let totalFetchedItemCount = 0;

const NotificationScreen = memo(function NotificationScreen() {
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
            <AppHeader title="Notifications" />
            <FlatList
                data={notifications}
                renderItem={({ item }) => (<NotificationItem data={item} />)}
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
                    if (notificationsLoading === "idle" || notificationsLoading === "pending") {
                        return <NotificationLoader />
                    }
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
}: {
    data: Notification,
}) {
    const [readMore, setReadMore] = useState(false)
    const navigation = useNavigation();
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
            gap: 8,
            alignItems: 'center',
            width: '65%',
        }}>
            <Avatar url={data.author?.profilePicture} size={55} onPress={() => {
                if (!data.author?.username) return ToastAndroid.show('User not found', ToastAndroid.SHORT)
                navigation.navigate("Profile", { id: data.author.username })
            }} />
            <View style={{ paddingHorizontal: 2 }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <Text numberOfLines={readMore ? 20 : 3} ellipsizeMode="tail">
                        <TouchableWithoutFeedback
                            onPress={() => {
                                if (!data.author?.username) return
                                navigation.navigate("Profile", { id: data?.author?.username })
                            }}>
                            <Text variant="H6" lineBreakMode="clip" numberOfLines={2}>
                                {data.author?.username} {''}
                            </Text>
                        </TouchableWithoutFeedback>
                        <Text variantColor="secondary" lineBreakMode="tail" numberOfLines={2}>
                            {data.type === NotificationType.Like ? 'liked your post' : data.type === NotificationType.Comment ? 'commented on your post: ' : 'followed you'}
                        </Text>
                        <Text variantColor="secondary" numberOfLines={2} ellipsizeMode="tail">
                            {data?.comment?.content}
                        </Text>
                    </Text>
                </View>
                <Text variantColor="secondary">
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
                flex: 0
            }} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
})

const NotificationLoader = () => {
    const { currentTheme } = useTheme();
    const background = currentTheme.input
    return <>
        {Array(12).fill(0).map((_, i) => <View
            key={i}
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
                gap: 8,
                alignItems: 'center',
                width: '65%',
            }}>
                <View style={{
                    width: 55,
                    height: 55,
                    borderRadius: 100,
                    backgroundColor: background
                }} />
                <View style={{ paddingHorizontal: 2 }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                    }}>
                        <View style={{
                            gap: 5
                        }}>
                            <View style={{
                                width: 180,
                                height: 14,
                                borderRadius: 100,
                                backgroundColor: background
                            }} />
                            <View style={{
                                width: 120,
                                height: 12,
                                borderRadius: 10,
                                backgroundColor: background
                            }} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={{
                aspectRatio: 1 / 1,
                flex: 0,
                width: 60,
                height: 60,
                borderRadius: 12,
                backgroundColor: background
            }} />
        </View>)}
    </>
}