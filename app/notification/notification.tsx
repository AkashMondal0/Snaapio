import React, { memo, useState } from "react";
import { Avatar, Image } from "@/components/skysolo-ui";
import { FlatList, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import AppHeader from "@/components/AppHeader";
import { Notification, NotificationType } from "@/types";
import { timeAgoFormat } from "@/lib/timeFormat";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import { Loader, Text, TouchableOpacity, useTheme, } from "hyper-native-ui";
import { useNavigation } from "@react-navigation/native";
import { NQ } from "@/redux-stores/slice/notification/notification.queries";
import { useGQArray } from "@/lib/useGraphqlQuery";

const NotificationScreen = memo(function NotificationScreen() {
    const { data, error, loadMoreData, loading, reload, requestCount } = useGQArray<Notification>({
        query: NQ.findAllNotifications
    });

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Notifications" />
            <FlatList
                data={data}
                renderItem={({ item }) => (<NotificationItem data={item} />)}
                keyExtractor={(item, index) => index.toString()}
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={loadMoreData}
                refreshing={false}
                onRefresh={reload}
                ListEmptyComponent={() => {
                    if (error && loading === "normal") {
                        return <ErrorScreen message={error} />;
                    }
                    if (data.length <= 0 && loading === "normal") {
                        return <ListEmpty text="No Notification yet" />;
                    }
                    return <View />
                }}
                ListFooterComponent={() => {
                    if (loading !== "normal" && requestCount === 0) {
                        return <NotificationLoader />;
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
        <TouchableOpacity style={{
            width: 60,
            aspectRatio: 1 / 1,
            flex: 0
        }} activeOpacity={0.8} onPress={() => {
            if (!data.postId) return ToastAndroid.show('Post not found', ToastAndroid.SHORT)
            navigation.navigate("Post", { id: data.postId })
        }} >
            <Image url={data.post?.fileUrl[0].square_sm}
                showImageError
                style={{
                    width: "100%",
                    borderRadius: 10,
                }} />
        </TouchableOpacity>
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