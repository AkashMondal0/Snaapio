import React from 'react'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CircleUserRound, Film, HomeIcon, PlusCircle, Search } from "lucide-react-native"
import { View } from '@/components/skysolo-ui';
// screens
import FeedsScreen from "./feeds";
import ProfileScreen from "./profile";
import ReelsScreen from "./reels";
import SearchScreen from "./search";
import CameraScreen from '../camera';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { TouchableOpacity } from 'react-native';
import { tabChange } from '@/redux-stores/slice/theme';
const Tab = createBottomTabNavigator();

const BottomTab = () => {

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{
                    tabBarHideOnKeyboard: true,
                }}
                tabBar={(props: React.JSX.IntrinsicAttributes & BottomTabBarProps) => <MyTabBar {...props} />}>
                <Tab.Screen name="feeds" component={FeedsScreen} options={{ headerShown: false }} />
                <Tab.Screen name="search" component={SearchScreen} options={{ headerShown: false }} />
                <Tab.Screen name="create" component={CameraScreen} options={{ headerShown: false }} />
                <Tab.Screen name="reels" component={ReelsScreen} options={{ headerShown: false }} />
                <Tab.Screen name="profile" component={ProfileScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
        </View>
    )
}

export default BottomTab


function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const dispatch = useDispatch()

    const getIcon = (routeName: string, isFocused: boolean) => {
        let iconSize = 28;
        let iconColor = currentTheme?.foreground;
        if (isFocused) {
            iconColor = currentTheme?.primary;
        }
        if (routeName === 'feeds') {
            return <HomeIcon size={iconSize} color={iconColor} />
        }
        else if (routeName === 'search') {
            return <Search size={iconSize} color={iconColor} />
        }
        else if (routeName === 'create') {
            return <PlusCircle size={iconSize} color={iconColor} />
        }
        else if (routeName === 'reels') {
            return <Film size={iconSize} color={iconColor} />
        }
        else if (routeName === 'profile') {
            return <CircleUserRound size={iconSize} color={iconColor} />
        }
    }

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 8,
            borderTopWidth: 0.6,
            borderTopColor: currentTheme?.border,
            backgroundColor: currentTheme?.background,
            elevation: 0,
            height: 60,
        }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                if (route.name === "create") {
                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={() => { dispatch(tabChange(0)) }}
                            onLongPress={() => { navigation.navigate("Root", { screen: 'camera' }) }}
                            style={{ flex: 1, alignItems: 'center' }}
                        >
                            {getIcon(route.name, isFocused)}
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, alignItems: 'center' }}
                    >
                        {getIcon(route.name, isFocused)}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
