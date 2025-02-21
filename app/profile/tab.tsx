import AppHeader from "@/components/AppHeader";
import React, { memo, useCallback, useState } from "react";
import FollowersScreen from "./followers";
import FollowingScreen from "./following";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions, View } from "react-native";
import { useTheme } from 'hyper-native-ui';
import ErrorScreen from "@/components/error/page";
import { useGQArray } from "@/lib/useGraphqlQuery";
import { AuthorData } from "@/types";
import { QProfile } from "@/redux-stores/slice/profile/profile.queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";

type Props = {
    route: {
        path: string
        params: {
            id: string;
            section: string
        }
    }
}

const routes = [
    { key: 'first', title: 'Follower' },
    { key: 'second', title: 'Following' },
];

const TabFollowingAndFollowers = memo(function TabFollowingAndFollowers({ route }: Props) {
    const path = route.path ? (route.path.includes('following') ? 1 : 0) : route.params?.section === "Following" ? 1 : 0 || 0;
    const userId = route.params.id;
    const { currentTheme } = useTheme();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(path);
    const session = useSelector((state: RootState) => state.AuthState.session.user);
    const AuthorId = session?.username === userId;
    const {
        data: dataFollowing,
        error: errorFollowing,
        loadMoreData: loadMoreDataFollowing,
        loading: loadingFollowing,
        reload: reloadFollowing } = useGQArray<AuthorData>({
            query: QProfile.findAllFollowing,
            variables: { id: userId }
        });

    const { data: dataFollower,
        error: errorFollower,
        loadMoreData: loadMoreDataFollower,
        loading: loadingFollower,
        reload: reloadFollower } = useGQArray<AuthorData>({
            query: QProfile.findAllFollower,
            variables: { id: userId }
        });

    const FollowersTab = useCallback(() => {
        return <FollowersScreen
            error={errorFollower}
            loading={loadingFollower}
            onEndReached={loadMoreDataFollower}
            onRefresh={reloadFollower}
            data={dataFollower}
            isFollowing={AuthorId} />
    }, [loadingFollower, errorFollower, dataFollower, AuthorId])

    const FollowingTab = useCallback(() => {
        return <FollowingScreen
            error={errorFollowing}
            loading={loadingFollowing}
            onEndReached={loadMoreDataFollowing}
            onRefresh={reloadFollowing}
            data={dataFollowing}
            isFollowing={AuthorId}
        />
    }, [loadingFollowing, errorFollowing, dataFollowing, AuthorId])

    if (errorFollowing || errorFollower) return <ErrorScreen />;

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title={userId}
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
        </View>
    )
})
export default TabFollowingAndFollowers;