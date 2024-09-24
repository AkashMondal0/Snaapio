import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { InitialScreen, LoginScreen, RegisterScreen } from '@/app/auth';
import HomeScreen from '@/app/home';
import CameraScreen from '@/app/camera';
import { ChatListScreen, ChatScreen } from '@/app/message';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { PostScreen, CommentScreen, LikeScreen } from '@/app/post';
import { NotificationScreen } from '@/app/screens';
import { PostsScreen, TabFollowingAndFollowers } from './app/profile';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// import Toast from 'react-native-toast-message';
SplashScreen.preventAutoHideAsync();
// const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();


// export function TopTabBar() {
//   const background = useSelector((state: RootState) => state.ThemeState.currentTheme?.background)

//   if (!background) {
//     return <></>;
//   }

//   return (
//     <Tab.Navigator
//       tabBar={() => null}
//       initialRouteName='feed'
//       backBehavior="initialRoute"
//       initialLayout={{ width: "100%", height: 100 }}
//       screenOptions={{ headerShown: false }}
//       sceneContainerStyle={{ backgroundColor: background }}>
//       <Tab.Screen name="camera" component={CameraScreen} />
//       <Tab.Screen name="feed" component={HomeScreen} />
//       <Tab.Screen name="message" component={ChatListScreen} />
//     </Tab.Navigator>
//   );
// }

function Routes(backgroundColor: any) {
  const session = useSelector((state: RootState) => state.AuthState.session)
  const insets = useSafeAreaInsets();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: backgroundColor,
          width: '100%',
          height: '100%',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        animation: 'slide_from_right',
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 150 } },  // Fast opening transition
          close: { animation: 'timing', config: { duration: 150 } }, // Fast closing transition
        },
        detachPreviousScreen: true, // Optimize memory by detaching previous screen
        cardOverlayEnabled: false, // No dimmed overlay
        // gestureEnabled: Platform.OS === 'ios', // Disable gestures on Android
      }}>
      {session.user ?
        <>
          {/* feeds */}
          <Stack.Screen name="Root" component={HomeScreen} />
          {/* settings */}
          <Stack.Screen name={"settings"} component={SettingScreen} />
          <Stack.Screen name={"settings/theme"} component={ThemeSettingScreen} />
          {/* chat */}
          <Stack.Screen name="message" component={ChatListScreen} />
          <Stack.Screen name="message/conversation" component={ChatScreen} />
          {/* post */}
          <Stack.Screen name="post" component={PostScreen} />
          <Stack.Screen name="post/like" component={LikeScreen} />
          <Stack.Screen name="post/comment" component={CommentScreen} />
          {/* notification */}
          <Stack.Screen name="notification" component={NotificationScreen} />
          {/* profile */}
          <Stack.Screen name="profile/posts" component={PostsScreen} />
          <Stack.Screen name="profile/followersAndFollowing" component={TabFollowingAndFollowers} />
          {/* camera */}
          <Stack.Screen name="camera" component={CameraScreen} />
        </> :
        <>
          <Stack.Screen name="auth" component={InitialScreen} />
          <Stack.Screen name="auth/login" component={LoginScreen} />
          <Stack.Screen name="auth/register" component={RegisterScreen} />
        </>}
    </Stack.Navigator >
  );
}

function Root() {
  const background = useSelector((state: RootState) => state.ThemeState.currentTheme?.background)

  return (<>
    {/* <Toast /> */}
    <PreConfiguration />
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <BottomSheetProvider>
            <Routes backgroundColor={background} />
          </BottomSheetProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  </>)

}

export default function App() {

  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
};