/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@/components/skysolo-ui";
import { RootState } from "@/redux-stores/store";
import { AuthorData } from "@/types";
import { memo } from "react";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import { Button, Loader, Text, useTheme } from "hyper-native-ui";
import { StackActions, useNavigation } from "@react-navigation/native";
import { DiscoverUserItemLoader } from "@/components/loader/user-loader";
import AppHeader from "@/components/AppHeader";
import { useGQArray } from "@/lib/useGraphqlQuery";
import { QUsers } from "@/redux-stores/slice/users/users.queries";
import { createFriendshipApi, destroyFriendshipApi } from "@/redux-stores/slice/profile/api.service";
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { setLocation } from "@/redux-stores/slice/auth";

const DiscoverPeopleScreen = memo(function DiscoverPeopleScreen() {
    const location = useSelector((state: RootState) => state.AuthState.location);
    const dispatch = useDispatch();

    async function getCurrentLocation() {
        try {
            if (Platform.OS === 'android' && !Device.isDevice) {
                return ToastAndroid.show("Oops, this will not work on Snack in an Android Emulator. Try it on your device!", ToastAndroid.SHORT);
            };

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                dispatch(setLocation({
                    lat: 0,
                    lon: 0,
                    status: 'denied'
                }))
                return ToastAndroid.show("Permission to access location was denied", ToastAndroid.SHORT);
            };

            const location = await Location.getCurrentPositionAsync({});
            dispatch(setLocation({
                lat: location.coords.latitude,
                lon: location.coords.longitude,
                status: "granted"
            }))
        } catch (error) {
            ToastAndroid.show("Something's went Wrong", ToastAndroid.SHORT)
        }
    };

    useEffect(() => {
        if (location.status === "denied") {
            getCurrentLocation();
        };
    }, []);

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader
                title="Discover People"
                key={"setting-page-3"} />
            {location.status === "denied" ? <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 10
            }}>
                <Text>Allow Permission</Text>
                <Button width={100} onPress={getCurrentLocation}>
                    Allow
                </Button>
            </View> : <ListComponent lat={location?.lat} lon={location?.lon} />}
        </View>
    )
});
export default DiscoverPeopleScreen;

const ListComponent = memo(function ListComponent({
    lat,
    lon
}: {
    lat: number
    lon: number
}) {
    const {
        data,
        error,
        loadMoreData,
        loading,
        reload,
    } = useGQArray<AuthorData>({
        query: QUsers.findNearestUsers,
        initialFetch: false,
        variables: {
            distance: 20,
            latitude: lat,
            longitude: lon
        }
    });
    return <FlatList
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        windowSize={10}
        numColumns={2}
        data={data}
        renderItem={({ item }) => (<Item data={item} />)}
        keyExtractor={(item, index) => item.id}
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
                return <ListEmpty text="No People yet" />;
            }
            return <View />
        }}
        ListFooterComponent={() => {
            if (loading !== "normal" && data.length === 0) {
                return <DiscoverUserItemLoader />;
            }
            if (loading === "pending") {
                return <Loader size={50} />
            }
            return <View />;
        }}
    />
}, (() => true))

const Item = memo(function FollowingItem({
    data,
}: {
    data: AuthorData,
}) {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const session = useSelector((state: RootState) => state.AuthState.session.user);
    const onPress = () => navigation.dispatch(StackActions.push("Profile", { id: data.username }));
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState(data.following);

    const handleFollowApi = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        if (!session?.id) {
            ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
            setLoading(false);
            return;
        }
        if (!session?.id) {
            ToastAndroid.show('User login issue', ToastAndroid.SHORT);
            setLoading(false);
            return;
        }
        await createFriendshipApi({
            authorUserId: session.id,
            authorUsername: session.username,
            followingUserId: data.id,
            followingUsername: data.username,
        });
        setFollowing(true);
        setLoading(false);
    }, [loading, session, data]);

    const handleUnFollowApi = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        if (!session?.id) {
            ToastAndroid.show('You are not logged in', ToastAndroid.SHORT);
            setLoading(false);
            return;
        }
        if (!session?.id) {
            ToastAndroid.show('User login issue', ToastAndroid.SHORT);
            setLoading(false);
            return;
        }
        await destroyFriendshipApi({
            authorUserId: session.id,
            authorUsername: session.username,
            followingUserId: data.id,
            followingUsername: data.username,
        });
        setFollowing(false);
        setLoading(false);
    }, [loading, session, data]);

    const onFollowHandle = useCallback(() => {
        if (following) {
            handleUnFollowApi();
        } else {
            handleFollowApi();
        }
    }, [following, handleUnFollowApi, handleFollowApi]);


    return (
        <View style={{
            padding: 6,
            width: "50%",
        }}>
            <View
                style={{
                    padding: 8,
                    borderColor: currentTheme.border,
                    borderWidth: 1,
                    borderRadius: 16,
                }}>
                <View style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    paddingVertical: 10
                }}>
                    <Avatar url={data.profilePicture} size={100} onPress={onPress} />
                    <View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent:"center",
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
                <Button
                    textStyle={{ fontSize: 14 }}
                    onPress={onFollowHandle}
                    disabled={loading}
                    variant={following ? "secondary" : "default"}
                    size="medium">
                    {following ? "Unfollow" : "Follow"}
                </Button>
            </View>
        </View>
    )
}, (() => true))