import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import * as SplashScreen from 'expo-splash-screen';
import ThemeProvider from '@/provider/ThemeProvider'
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
import { HomeScreen, CameraScreen } from '@/app/home';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { ChatListScreen, ChatScreen } from '@/app/home/message';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native';
const Tab = createMaterialTopTabNavigator();
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();


export function TopTabBar() {

  return (
    <Tab.Navigator
      tabBar={() => null}
      backBehavior="initialRoute"
      initialLayout={{
        width: Dimensions.get('window').width,
        height: 100,
      }}
      initialRouteName='home'>
      <Tab.Screen name="camera" component={CameraScreen} />
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="message" component={ChatListScreen} />
    </Tab.Navigator>
  );
}

function Routes() {
  // const { isLogin } = useSelector((state: RootState) => state.authState)

  // const backgroundColor = useTheme.background

  // const Options = {
  //   headerTintColor: useTheme.iconColor,
  //   headerTitleAlign: 'center',
  //   animation: "slide_from_right",
  //   animationDuration: 300,
  //   headerStyle: {
  //     backgroundColor: backgroundColor,
  //   },
  //   headerTitleStyle: {
  //     fontSize: 20,
  //     fontWeight: '800',
  //     color: useTheme.primaryTextColor,
  //   },
  //   contentStyle: {
  //     backgroundColor: backgroundColor,
  //     elevation: 0,
  //     height: 100,
  //   }
  // }

  // const Option2 = {
  //   headerShown: false,
  //   animation: "slide_from_right",
  //   animationDuration: 300,
  //   contentStyle: {
  //     backgroundColor: backgroundColor,
  //     elevation: 0,
  //     height: "auto"
  //   }
  // }
  return (
    <Stack.Navigator initialRouteName='Root'>
      {/* feeds */}
      <Stack.Screen name="Root" component={TopTabBar} options={{ headerShown: false }} />
      {/* <Stack.Screen name="notification" component={SettingScreen} options={{ headerShown: false }} /> */}
      {/* settings */}
      <Stack.Screen name="setting" component={SettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="settingTheme" component={ThemeSettingScreen} options={{ headerShown: false }} />

      {/* profile */}
      {/* <Stack.Screen name="profile" component={SettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" component={SettingScreen} options={{ headerShown: false }} /> */}

      {/* post */}
      {/* <Stack.Screen name="post" component={SettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="like" component={SettingScreen} options={{ headerShown: false }} /> */}


      {/* chat */}
      <Stack.Screen name="chat" component={ChatScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function Root() {
  const background = useSelector((state: RootState) => state.ThemeState.currentTheme?.background)
  return (<>
    <ThemeProvider />
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <NavigationContainer>
        <BottomSheetProvider>
          <Routes />
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