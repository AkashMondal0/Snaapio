/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { FlatList, View, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@/components/skysolo-ui";
import { RootState } from "@/redux-stores/store";
import { AuthorData, Conversation, disPatchResponse, loadingType, NavigationProps } from "@/types";
import { memo } from "react";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import { setConversation } from "@/redux-stores/slice/conversation";
import { CreateConversationApi } from "@/redux-stores/slice/conversation/api.service";
import { Button, Loader, Text, TouchableOpacity } from "hyper-native-ui";
import { StackActions, useNavigation } from "@react-navigation/native";
import UserItemLoader from "@/components/loader/user-loader";

interface ScreenProps {
    data: AuthorData[],
    isFollowing: boolean,
    onEndReached: VoidFunction
    onRefresh: VoidFunction
    loading: loadingType
    error?: any
}

const FollowersScreen = memo(function FollowersScreen({
    data,
    isFollowing,
    onEndReached,
    onRefresh,
    loading,
    error
}: ScreenProps) {
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <FlatList
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                data={data}
                renderItem={({ item }) => (<FollowingItem data={item}
                    isFollowing={isFollowing} />)}
                keyExtractor={(item, index) => index.toString()}
                bounces={false}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                refreshing={false}
                onRefresh={onRefresh}
                ListEmptyComponent={() => {
                    if (loading === "idle" || loading === "pending") return <UserItemLoader />
                    if (error) return <ErrorScreen message={error} />
                    if (!error && loading === "normal") return <ListEmpty text="No followers yet" />
                }}
                ListFooterComponent={loading === "pending" ? <Loader size={50} /> : <></>}
            />
        </View>
    )
}, (prevProps, nextProps) => {
    return prevProps.data.length === nextProps.data.length &&
        prevProps.loading === nextProps.loading
});
export default FollowersScreen;

const FollowingItem = memo(function FollowingItem({
    data,
    isFollowing,
}: {
    data: AuthorData,
    isFollowing: boolean,
}) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const onPress = () => navigation.dispatch(StackActions.push("Profile", { id: data.username }));
    const navigateToMessagePage = async () => {
        try {
            if (!session?.id) return ToastAndroid.show('You are not logged in', ToastAndroid.SHORT)
            if (!data || data?.id === session?.id) return ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            const res = await dispatch(CreateConversationApi([data.id]) as any) as disPatchResponse<Conversation>
            if (res.error) return ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
            dispatch(setConversation({
                id: res.payload.id,
                isGroup: false,
                user: data,
            } as Conversation))
            navigation?.navigate("MessageRoom", { id: res.payload.id })
        } catch (error) {
            ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
        }
    }
    return (<TouchableOpacity
        onPress={onPress}
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
        }}>
            <Avatar url={data.profilePicture} size={60} onPress={onPress} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Text variant="H6">
                        {data.username}
                    </Text>
                </View>
                <Text variantColor="secondary">
                    {data.name}
                </Text>
            </View>
        </View>
        {isFollowing ? <Text>You</Text> : <Button
            textStyle={{
                fontSize: 14,
            }}
            onPress={navigateToMessagePage}
            size="medium"
            variant="secondary">
            Message
        </Button>}
    </TouchableOpacity>)
}, (() => true))