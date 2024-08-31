import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CircleDashed, CircleUserRound, MessageSquareText, Phone } from "lucide-react-native"
import { View } from '@/components/skysolo-ui';
// screens
import FeedsScreen from "./feeds";
import ProfileScreen from "./profile";
import ReelsScreen from "./reels";
import SearchScreen from "./search";

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }: any) => {

    const seenCount = 0
    const totalUnseen = 0


    return (
        <View style={{
            flex: 1,
        }}>
            <Tab.Navigator
                sceneContainerStyle={{
                }}
                screenOptions={({ route }) => ({
                    // tabBarActiveTintColor: useTheme.primary,
                    // tabBarInactiveTintColor: useTheme.iconColor,
                    tabBarStyle: {
                        height: 70,
                        elevation: 0,
                        borderTopWidth: 0,
                    },
                    tabBarIcon: ({ focused }) => {
                        let iconSize;
                        let iconColor;
                        if (focused) {
                            iconSize = 30;
                            // iconColor = useTheme.primary;
                        } else {
                            iconSize = 25;
                            // iconColor = useTheme.iconColor;
                        }
                        if (route.name === 'Chats') {
                            return <MessageSquareText size={iconSize} color={iconColor} />
                        }
                        else if (route.name === 'Status') {
                            return <CircleDashed size={iconSize} color={iconColor} />
                        }
                        else if (route.name === 'Calls') {
                            return <Phone size={iconSize} color={iconColor} />
                        }
                        else if (route.name === 'Profile') {
                            return <CircleUserRound size={iconSize} color={iconColor} />
                        }
                    },
                    tabBarLabelStyle: {
                        fontSize: 14,
                        paddingBottom: 8,
                    },
                    // notification badge
                    tabBarBackground() {
                        return (
                            <View style={{
                                flex: 1,
                                width: "100%",
                                height: "100%",
                            }}/>
                        )
                    },
                })}>
                <Tab.Screen name="feeds" component={FeedsScreen} options={{
                    tabBarBadge: totalUnseen,
                    headerShown: false,
                    tabBarBadgeStyle: {
                        opacity: totalUnseen > 0 ? 1 : 0,
                        fontSize: 14,
                        // backgroundColor: useTheme.badge,
                        // color: useTheme.color,
                        borderRadius: 50,
                    },}} />
                <Tab.Screen name="search" component={SearchScreen} options={{
                    headerShown: false,
                }} />
                <Tab.Screen name="reels" component={ReelsScreen} options={{
                    headerShown: false,
                }} />
                <Tab.Screen name="Profile" component={ProfileScreen} options={{
                    headerShown: false,
                    tabBarBadge: "new",
                }} />

            </Tab.Navigator>
        </View>
    )
}

export default BottomTab