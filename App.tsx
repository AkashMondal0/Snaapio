import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
import { InitialScreen, LoginScreen, RegisterScreen } from '@/app/auth';
import BottomTabComponent from '@/app/home';
import {
  AskAiChatScreen,
  AssetSelectScreen,
  ChatAssetsReviewScreen,
  ChatListScreen,
  ChatScreen,
  ImagePreviewScreen,
  NewChatScreen
} from '@/app/message';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import SocketConnections from '@/provider/SocketConnections';
import { PostReviewScreen, NewPostSelectionScreen } from '@/app/upload';
import { ProfileEditScreen } from '@/app/profile';
import { PostScreen } from '@/app/post';
import { StoryScreen, StorySelectingScreen, StoryUploadScreen } from '@/app/story';
import { HighlightPageScreen, HighlightSelectingScreen, HighlightUploadScreen } from '@/app/highlight';
import { ThemeProvider, useTheme } from 'hyper-native-ui';
import { StatusBar } from 'react-native';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

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
        }
      }}>
      {session.user ?
        <>
          {/* feeds */}
          <Stack.Screen name="Root" component={BottomTabComponent} />
          {/* profile */}
          <Stack.Screen name="profile/edit" component={ProfileEditScreen} />
          {/* post */}
          <Stack.Screen name="post" component={PostScreen} />
          <Stack.Screen name="story" component={StoryScreen} />
          <Stack.Screen name="story/upload" component={StoryUploadScreen} />
          {/* highlight */}
          <Stack.Screen name="highlight" component={HighlightPageScreen} />
          <Stack.Screen name="highlight/selection" component={HighlightSelectingScreen} />
          <Stack.Screen name="highlight/upload" component={HighlightUploadScreen} />

          {/* settings */}
          <Stack.Group>
            <Stack.Screen name="settings" component={SettingScreen} />
            <Stack.Screen name="settings/theme" component={ThemeSettingScreen} />
          </Stack.Group>
          {/* chat */}
          <Stack.Group>
            <Stack.Screen name="message" component={ChatListScreen} />
            <Stack.Screen name="message/conversation" component={ChatScreen} />
            <Stack.Screen name="message/searchNewChat" component={NewChatScreen} />
            <Stack.Screen name="message/asset/review" component={ChatAssetsReviewScreen} />
            <Stack.Screen name="message/assets/preview" component={ImagePreviewScreen} />
            <Stack.Screen name="message/askAiChat" component={AskAiChatScreen} />
          </Stack.Group>
          {/* select assets */}
          <Stack.Group screenOptions={{
            animation: 'slide_from_bottom',
            presentation: 'modal'
          }} >
            <Stack.Screen name="message/asset/selection" component={AssetSelectScreen} />
            <Stack.Screen name="upload/post/selection" component={NewPostSelectionScreen} />
            <Stack.Screen name="story/selection" component={StorySelectingScreen} />
          </Stack.Group>
          {/* upload */}
          <Stack.Screen name="upload/post/review" component={PostReviewScreen} />
        </> :
        <>
          <Stack.Group>
            <Stack.Screen name="auth" component={InitialScreen} />
            <Stack.Screen name="auth/login" component={LoginScreen} />
            <Stack.Screen name="auth/register" component={RegisterScreen} />
          </Stack.Group>
        </>}
    </Stack.Navigator >
  );
}

function Root() {
  const { currentTheme, themeScheme } = useTheme();

  return (<>
    <StatusBar barStyle={themeScheme === "dark" ? "light-content" : "dark-content"}
      backgroundColor={currentTheme.background} />
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <SocketConnections >
            <PreConfiguration />
            <BottomSheetProvider>
              <Routes backgroundColor={currentTheme.background} />
            </BottomSheetProvider>
          </SocketConnections>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  </>)

}

export default function App() {

  return (
    <ThemeProvider>
      <Provider store={store}>
        <Root />
      </Provider>
    </ThemeProvider>
  );
};