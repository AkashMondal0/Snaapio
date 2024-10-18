import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
import { InitialScreen, LoginScreen, RegisterScreen } from '@/app/auth';
import BottomTabComponent from '@/app/home';
import { AssetSelectScreen, ChatAssetsReviewScreen, ChatListScreen, ChatScreen, NewChatScreen } from '@/app/message';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import SocketConnections from '@/provider/SocketConnections';
import { resetConversation } from '@/redux-stores/slice/conversation';
import { PostReviewScreen, NewPostSelectionScreen } from '@/app/upload';
import { ProfileEditScreen } from '@/app/profile';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

function Routes(backgroundColor: any) {
  const session = useSelector((state: RootState) => state.AuthState.session)
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  return (
    <Stack.Navigator
      screenListeners={({ navigation, route }: any) => ({
        state: (e: any) => {
          if (e?.data?.state?.routes[e?.data?.state?.index]?.name === "message") return dispatch(resetConversation())
        },
      })}
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
          <Stack.Screen name={"profile/edit"} component={ProfileEditScreen} />
          {/* settings */}
          <Stack.Screen name={"settings"} component={SettingScreen} />
          <Stack.Screen name={"settings/theme"} component={ThemeSettingScreen} />
          {/* chat */}
          <Stack.Screen name="message" component={ChatListScreen} />
          <Stack.Screen name="message/conversation" component={ChatScreen} />
          <Stack.Screen name="message/searchNewChat" component={NewChatScreen} />
          <Stack.Screen name="message/asset/selection" component={AssetSelectScreen} options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }} />
          <Stack.Screen name="message/asset/review" component={ChatAssetsReviewScreen} />
          {/* upload */}
          <Stack.Screen name="upload/post/selection" component={NewPostSelectionScreen} options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }} />
          <Stack.Screen name="upload/post/review" component={PostReviewScreen} />
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
  const background = useSelector((state: RootState) => state.ThemeState.currentTheme?.background, (prev, next) => prev === next)

  return (<>
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <SocketConnections >
            <PreConfiguration />
            <BottomSheetProvider>
              <Routes backgroundColor={background} />
            </BottomSheetProvider>
          </SocketConnections>
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