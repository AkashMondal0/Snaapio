// import React, { memo } from 'react'
// import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Film, HomeIcon, PlusCircle, Search } from "lucide-react-native"
// import { TouchableOpacity, View } from 'react-native';
// import { RootState } from '@/redux-stores/store';
// import { useSelector } from 'react-redux';
// import { Avatar } from '@/components/skysolo-ui';
// // screens
// import FeedsScreen from "./feeds";
// import ProfileScreen from "./account";
// import ReelsScreen from "./reels";
// import SearchScreen from "./search";
// import Pages from './pages';
// import { NewPostSelectionScreen } from '@/app/upload';
// import { useTheme } from 'hyper-native-ui';

// const Tab = createBottomTabNavigator();

// const HomeScreen = memo(function HomeScreen() {
//     const { currentTheme } = useTheme();

//     function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

//         const getIcon = (routeName: string, isFocused: boolean, onPress: any) => {
//             let iconSize = isFocused ? 32 : 28;
//             let iconColor = isFocused ? currentTheme?.primary : currentTheme?.foreground;
//             if (routeName === 'home') {
//                 return <HomeIcon size={iconSize} color={iconColor} />
//             }
//             else if (routeName === 'search') {
//                 return <Search size={iconSize} color={iconColor} />
//             }
//             else if (routeName === 'create') {
//                 return <PlusCircle size={iconSize} color={iconColor} />
//             }
//             else if (routeName === 'reels') {
//                 return <Film size={iconSize} color={iconColor} />
//             }
//             else if (routeName === 'account') {
//                 return <AccountIcon onPress={onPress} />
//             }
//         }

//         return (
//             <View style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-around',
//                 alignItems: 'center',
//                 padding: 8,
//                 borderTopWidth: 0.6,
//                 borderTopColor: currentTheme?.border,
//                 backgroundColor: currentTheme?.background,
//                 elevation: 0,
//                 height: 60,
//             }}>
//                 {state.routes.map((route, index) => {
//                     const { options } = descriptors[route.key];
//                     const isFocused = state.index === index;
//                     const onPress = () => {
//                         const event = navigation.emit({
//                             type: 'tabPress',
//                             target: route.key,
//                             canPreventDefault: true,
//                         });
//                         if (!isFocused && !event.defaultPrevented) {
//                             navigation.navigate(route.name, route.params);
//                         }
//                     };

//                     const onLongPress = () => {
//                         navigation.emit({
//                             type: 'tabLongPress',
//                             target: route.key,
//                         });
//                     };
//                     return (
//                         <TouchableOpacity
//                             key={index}
//                             accessibilityRole="button"
//                             accessibilityState={isFocused ? { selected: true } : {}}
//                             accessibilityLabel={options.tabBarAccessibilityLabel}
//                             testID={options.tabBarTestID}
//                             onPress={onPress}
//                             onLongPress={onLongPress}
//                             style={{ flex: 1, alignItems: 'center' }}>
//                             {getIcon(route.name, isFocused, onPress)}
//                         </TouchableOpacity>
//                     );
//                 })}
//             </View>
//         );
//     }

//     if (!currentTheme) {
//         return <></>;
//     }

//     return (
//         <View style={{
//             flex: 1,
//             backgroundColor: currentTheme?.background
//         }}>
//             <Tab.Navigator
//                 sceneContainerStyle={{
//                     backgroundColor: currentTheme?.background
//                 }}
//                 screenOptions={{
//                     tabBarHideOnKeyboard: true,
//                     headerShown: false,
//                 }}
//                 tabBar={MyTabBar}>
//                 <Tab.Screen name="home" component={HomeTab} />
//                 <Tab.Screen name="search" component={SearchTab} />
//                 <Tab.Screen name="create" component={NewPostSelectionScreen} />
//                 <Tab.Screen name="reels" component={ReelsScreen} />
//                 <Tab.Screen name="account" component={AccountTab} />
//             </Tab.Navigator>
//         </View>
//     )
// }, () => true)

// export default HomeScreen

// function HomeTab() {
//     return (
//         <Pages mainRouteName="feeds-index" ScreenComponent={FeedsScreen} />
//     )
// }

// function SearchTab() {
//     return (
//         <Pages mainRouteName="Search-index" ScreenComponent={SearchScreen} />
//     )
// }

// function AccountTab() {
//     return (
//         <Pages mainRouteName="Profile-index" ScreenComponent={ProfileScreen} />
//     )
// }

// const AccountIcon = memo(function AccountIcon({
//     onPress,
// }: {
//     onPress: () => void
// }) {
//     const sessionAvatarUrl = useSelector((state: RootState) => state.AuthState.session.user?.profilePicture, (prev, next) => prev === next)

//     return (
//         <Avatar size={30} url={sessionAvatarUrl} onPress={onPress} />
//     )
// }, () => true)