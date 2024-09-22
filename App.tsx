import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
import { InitialScreen, LoginScreen, RegisterScreen } from '@/app/auth';
import { configs } from '@/configs';
import HomeScreen from '@/app/home';
import CameraScreen from '@/app/camera';
import { ChatListScreen, ChatScreen } from '@/app/message';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { PostScreen, CommentScreen, LikeScreen } from '@/app/post';
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
      backBehavior="initialRoute"
      initialLayout={{
        width: Dimensions.get('window').width,
        height: 100,
      }}
      sceneContainerStyle={{
        backgroundColor: background,
      }}
      initialRouteName='home'>
      <Tab.Screen name="camera" component={CameraScreen} />
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="message" component={ChatListScreen} />
    </Tab.Navigator>
  );
}

function Routes(backgroundColor: string | any) {
  const session = useSelector((state: RootState) => state.AuthState.session)
  const option_slide_from_right = {
    headerShown: false,
    contentStyle: {
      backgroundColor: backgroundColor || "white",
      width: '100%',
      height: '100%',
    },
  }
  return (
    <Stack.Navigator>
      {session.user ?
        <>
          {/* feeds */}
          <Stack.Screen name="Root" component={TopTabBar} options={option_slide_from_right} />
          {/* settings */}
          <Stack.Screen name={configs.routesNames.settings.index} component={SettingScreen} options={option_slide_from_right} />
          <Stack.Screen name={configs.routesNames.settings.theme} component={ThemeSettingScreen} options={option_slide_from_right} />
          {/* chat */}
          <Stack.Screen name="chat" component={ChatScreen} options={option_slide_from_right} />
          {/* post */}
          <Stack.Screen name="post" component={PostScreen} options={option_slide_from_right} />
          <Stack.Screen name="like" component={LikeScreen} options={option_slide_from_right} />
          <Stack.Screen name="comment" component={CommentScreen} options={option_slide_from_right} />
        </> :
        <>
          <Stack.Screen name="initial" component={InitialScreen} options={option_slide_from_right} />
          <Stack.Screen name="login" component={LoginScreen} options={option_slide_from_right} />
          <Stack.Screen name="register" component={RegisterScreen} options={option_slide_from_right} />
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