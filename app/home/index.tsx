import React, { memo } from 'react'
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CircleUserRound, Film, HomeIcon, PlusCircle, Search } from "lucide-react-native"
import { TouchableOpacity, View } from 'react-native';
import { RootState } from '@/redux-stores/store';
import { useDispatch, useSelector } from 'react-redux';
// screens
import FeedsScreen from "./feeds";
import ProfileScreen from "./profile";
import ReelsScreen from "./reels";
import SearchScreen from "./search";
import CameraScreen from '../camera';
import { changeTabSwiped } from '@/redux-stores/slice/theme';
const Tab = createBottomTabNavigator();

const HomeScreen = memo(function HomeScreen() {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme, (prev, next) => prev === next)
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const tabSwiped = useSelector((state: RootState) => state.ThemeState.tabSwiped, (prev, next) => prev === next)
    const dispatch = useDispatch()


    function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

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
                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={() => {
                                if (route.name === "profile") {
                                    navigation.navigate("profile", {
                                        screen: 'profile', params: { username: session?.username }
                                    })
                                }
                                else if (route.name === "create") {
                                    if (!tabSwiped) dispatch(changeTabSwiped(true))
                                    navigation.navigate("Root", { screen: 'camera' })
                                }
                                else {
                                    onPress()
                                }
                            }}
                            onLongPress={onLongPress}
                            style={{ flex: 1, alignItems: 'center' }}>
                            {getIcon(route.name, isFocused)}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }

    if (!currentTheme) {
        return <></>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenListeners={() => ({
                    state: (e: any) => {
                        if (e.data.state.index === 0) {
                            if (tabSwiped) return
                            dispatch(changeTabSwiped(true))
                        } else {
                            if (!tabSwiped) return
                            dispatch(changeTabSwiped(false))
                        }
                    },
                })}
                sceneContainerStyle={{
                    backgroundColor: currentTheme?.background
                }}
                screenOptions={{
                    tabBarHideOnKeyboard: true,
                    headerShown: false,
                }}
                tabBar={MyTabBar}>
                <Tab.Screen name="feeds" component={FeedsScreen} options={{
                    headerShown: false,
                }} />
                <Tab.Screen name="search" component={SearchScreen} />
                <Tab.Screen name="create" component={CameraScreen} />
                <Tab.Screen name="reels" component={ReelsScreen} />
                <Tab.Screen name="profile" component={ProfileScreen} />
            </Tab.Navigator>
        </View>
    )
}, () => true)

export default HomeScreen


