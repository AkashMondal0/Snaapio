import AppHeader from "@/components/AppHeader";
import { RootState } from "@/redux-stores/store";
import { NavigationProps } from "@/types";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import FollowersScreen from "./followers";
import { ThemedView } from "@/components/skysolo-ui";
import FollowingScreen from "./following";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from "react-native";

interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            params: { username: string, tab: number }
        }
    }
}

const routes = [
    { key: 'first', title: 'Followers' },
    { key: 'second', title: 'Following' },
];

const TabFollowingAndFollowers = memo(function TabFollowingAndFollowers({ navigation, route }: ScreenProps) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [index, setIndex] = React.useState(route?.params?.params?.tab ?? 0);
    const layout = useWindowDimensions();

    const FollowersTab = () => {
        return <FollowersScreen navigation={navigation} username={route?.params?.params?.username} />
    }
    const FollowingTab = () => {
        return <FollowingScreen navigation={navigation} username={route?.params?.params?.username} />
    }

    const renderScene = SceneMap({
        first: FollowersTab,
        second: FollowingTab,
    });

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title={route?.params?.params?.username}
                navigation={navigation}
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
                renderScene={renderScene}
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