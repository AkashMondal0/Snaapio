import AppHeader from "@/components/AppHeader";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import FollowersScreen from "./followers";
import FollowingScreen from "./following";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from "react-native";
import { ThemedView, useTheme } from 'hyper-native-ui';
import { StaticScreenProps } from "@react-navigation/native";
import { fetchUserProfileFollowerUserApi, fetchUserProfileFollowingUserApi } from "@/redux-stores/slice/profile/api.service";
import { AuthorData, disPatchResponse, loadingType } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import ErrorScreen from "@/components/error/page";

type Props = StaticScreenProps<{
    id: string;
    section: string
}>;

const routes = [
    { key: 'first', title: 'Followers' },
    { key: 'second', title: 'Following' },
];

const TabFollowingAndFollowers = memo(function TabFollowingAndFollowers({ route }: Props) {
    const { currentTheme } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(route?.params?.section === "Following" ? 1 : 0 || 0);
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const [loading, setLoading] = useState<loadingType>('idle')
    const [error, setError] = useState<string | null>(null)
    const _followers = useRef<AuthorData[]>([])
    const _following = useRef<AuthorData[]>([])
    const totalFetchedItemCount_FG = useRef(0)
    const totalFetchedItemCount_FW = useRef(0)
    const dispatch = useDispatch()

    const fetchData_FG = useCallback(async () => {
        if (loading === "pending" || totalFetchedItemCount_FG.current === -1) return
        try {
            const res = await dispatch(fetchUserProfileFollowingUserApi({
                username: route.params.id,
                offset: totalFetchedItemCount_FG.current,
                limit: 12
            }) as any) as disPatchResponse<AuthorData[]>
            if (res.error) {
                setError(res?.error?.message || "An error occurred")
                return
            }
            if (res.payload.length <= 0) {
                totalFetchedItemCount_FG.current = -1
                return
            }
            _following.current.push(...res.payload)
            totalFetchedItemCount_FG.current += res.payload.length
        } catch (e: any) {

        }
    }, [loading])

    const fetchData_FW = useCallback(async () => {
        if (loading === "pending" || totalFetchedItemCount_FW.current === -1) return
        try {
            const res = await dispatch(fetchUserProfileFollowerUserApi({
                username: route.params.id,
                offset: totalFetchedItemCount_FW.current,
                limit: 12
            }) as any) as disPatchResponse<AuthorData[]>
            if (res.error) {
                setError(res?.error?.message || "An error occurred")
                return
            }
            if (res.payload.length <= 0) {
                totalFetchedItemCount_FW.current = -1
                return
            }
            _followers.current.push(...res.payload)
            totalFetchedItemCount_FW.current += res.payload.length
        } catch (e: any) {

        }
    }, [loading])

    const onEndReached_FW = useCallback(() => {
        if (totalFetchedItemCount_FW.current < 10 || loading === "pending" || loading === "idle") return
        fetchData_FW()
    }, [loading])

    const onEndReached_FG = useCallback(() => {
        if (totalFetchedItemCount_FG.current < 10 || loading === "pending" || loading === "idle") return
        fetchData_FG()
    }, [loading])

    const onRefresh = useCallback(async () => {
        if (loading === "pending") return
        setLoading("pending")
        _following.current = []
        _followers.current = []
        totalFetchedItemCount_FW.current = 0
        totalFetchedItemCount_FG.current = 0
        await fetchData_FW()
        await fetchData_FG()
        setLoading("normal")
    }, [loading])

    useEffect(() => {
        onRefresh()
    }, [])

    const FollowersTab = () => {
        return <FollowersScreen
            error={error}
            loading={loading}
            onEndReached={onEndReached_FW}
            onRefresh={onRefresh}
            data={_followers.current}
            isFollowing={session?.username === route.params.id} />
    }
    const FollowingTab = () => {
        return <FollowingScreen data={_following.current}
            error={error}
            loading={loading}
            onEndReached={onEndReached_FG}
            onRefresh={onRefresh}
            isFollowing={session?.username === route.params.id}
        />
    }
    if (error) return <ErrorScreen />
    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title={route?.params?.id ?? ""}
                containerStyle={{
                    borderBottomWidth: 0,
                }} />
            <TabView
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        labelStyle={{ fontSize: 16, textTransform: 'none', fontWeight: "500" }}
                        indicatorStyle={{ backgroundColor: currentTheme?.foreground }}
                        style={{ backgroundColor: currentTheme?.background }}
                        activeColor={currentTheme?.foreground}
                        inactiveColor={currentTheme?.foreground}
                    />
                )}
                navigationState={{ index, routes }}
                renderScene={SceneMap({
                    first: FollowersTab,
                    second: FollowingTab,
                })}
                sceneContainerStyle={{
                    backgroundColor: currentTheme?.background,
                }}
                style={{
                    backgroundColor: currentTheme?.background,
                }}

                pagerStyle={{
                    backgroundColor: currentTheme?.background,
                }}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
        </ThemedView>
    )
})
export default TabFollowingAndFollowers;