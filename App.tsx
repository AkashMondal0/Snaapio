import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { InitialScreen, LoginScreen, RegisterScreen } from '@/app/auth';
import HomeScreen from '@/app/home';
import CameraScreen from '@/app/camera';
import { ChatListScreen, ChatScreen } from '@/app/message';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { PostScreen, CommentScreen, LikeScreen } from '@/app/post';
import { NotificationScreen } from '@/app/screens';
import { FollowersScreen, FollowingScreen, PostsScreen } from './app/profile';
// import Toast from 'react-native-toast-message';
SplashScreen.preventAutoHideAsync();
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();


export function TopTabBar() {
  const background = useSelector((state: RootState) => state.ThemeState.currentTheme?.background)

  if (!background) {
    return <></>;
  }

  return (
    <Tab.Navigator
      tabBar={() => null}
      initialRouteName='feed'
      backBehavior="initialRoute"
      initialLayout={{ width: "100%", height: 100 }}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: background }}>
      <Tab.Screen name="camera" component={CameraScreen} />
      <Tab.Screen name="feed" component={HomeScreen} />
      <Tab.Screen name="message" component={ChatListScreen} />
    </Tab.Navigator>
  );
}

function Routes(backgroundColor: any) {
  const session = useSelector((state: RootState) => state.AuthState.session)

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor, width: '100%', height: '100%' }
    }}>
      {session.user ?
        <>
          {/* feeds */}
          <Stack.Screen name="Root" component={TopTabBar} />
          {/* settings */}
          <Stack.Screen name={"settings"} component={SettingScreen} />
          <Stack.Screen name={"settings/theme"} component={ThemeSettingScreen} />
          {/* chat */}
          <Stack.Screen name="message/conversation" component={ChatScreen} />
          {/* post */}
          <Stack.Screen name="post" component={PostScreen} />
          <Stack.Screen name="post/like" component={LikeScreen} />
          <Stack.Screen name="post/comment" component={CommentScreen} />
          {/* notification */}
          <Stack.Screen name="notification" component={NotificationScreen} />
          {/* profile */}
          <Stack.Screen name="profile/posts" component={PostsScreen} />
          <Stack.Screen name="profile/following" component={FollowingScreen} />
          <Stack.Screen name="profile/followers" component={FollowersScreen} />
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
      <NavigationContainer>
        <BottomSheetProvider>
          <Routes backgroundColor={background} />
        </BottomSheetProvider>
      </NavigationContainer>
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