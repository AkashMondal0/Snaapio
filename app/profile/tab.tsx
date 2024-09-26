import AppHeader from "@/components/AppHeader";
import { RootState } from "@/redux-stores/store";
import { NavigationProps } from "@/types";
import React, { memo } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowersScreen from "./followers";
import { Text } from "@/components/skysolo-ui";
import FollowingScreen from "./following";

const Tab = createMaterialTopTabNavigator();
interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            params: { username: string, tab: number }
        }
    }
}


const TabFollowingAndFollowers = memo(function TabFollowingAndFollowers({ navigation, route }: ScreenProps) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title={route?.params?.params?.username}
                navigation={navigation}
                containerStyle={{
                    borderBottomWidth: 0,
                }} />
            <Tab.Navigator
                backBehavior="none"
                sceneContainerStyle={{
                    backgroundColor: currentTheme?.background,
                }}
                screenOptions={{
                    tabBarLabelStyle: {
                        fontSize: 14,
                        color: currentTheme?.foreground
                    },
                    tabBarStyle: {
                        backgroundColor: currentTheme?.background,
                        elevation: 0, height: 50,
                        borderBottomWidth: 1,
                        borderColor: currentTheme?.border
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: currentTheme?.foreground,
                        height: 1.9
                    },
                    tabBarPressOpacity: 0.5,
                    tabBarPressColor: currentTheme?.muted,
                    tabBarLabel: ({ children }: any) => <Text variant="heading4"
                        style={{
                            fontSize: 16,
                        }}>
                        {children}
                    </Text>
                }}>
                <Tab.Screen name="followers" component={FollowersScreen} />
                <Tab.Screen name="following" component={FollowingScreen} />
            </Tab.Navigator>
        </View>
    )
})
export default TabFollowingAndFollowers;