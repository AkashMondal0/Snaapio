import AppHeader from "@/components/AppHeader";
import React, { memo } from "react";
import FollowersScreen from "./followers";
import FollowingScreen from "./following";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from "react-native";
import { ThemedView, useTheme } from 'hyper-native-ui';
import { StaticScreenProps } from "@react-navigation/native";

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
    const [index, setIndex] = React.useState(route?.params?.section === "Following" ? 1 : 0 || 0);
    const layout = useWindowDimensions();

    const FollowersTab = () => {
        return <FollowersScreen username={route?.params?.id} />
    }
    const FollowingTab = () => {
        return <FollowingScreen username={route?.params?.id} />
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
            <AppHeader title={route?.params?.id ?? ""}
                // navigation={navigation}
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