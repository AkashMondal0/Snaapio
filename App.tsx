import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/app/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import ThemeProvider from '@/app/provider/ThemeProvider'
import { SettingScreen, ThemeSettingScreen } from '@/app/screens/setting';
import { HomeScreen, CameraScreen, MessageScreen } from '@/app/screens/home';
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TopTabBar = ({ navigation }: any) => {
  return (
    <Tab.Navigator
      backBehavior='initialRoute'
      style={{ flex: 1 }}
      initialRouteName='main'
      overScrollMode={'never'}
      screenOptions={{ tabBarStyle: { display: "none" } }}>
      <Tab.Screen name="camera" component={CameraScreen} />
      <Tab.Screen name="main" component={HomeScreen} />
      <Tab.Screen name="message" component={MessageScreen} />
    </Tab.Navigator>
  )
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
    <Stack.Navigator initialRouteName='home'>
      {/* feeds */}
      <Stack.Screen name="home" component={TopTabBar} options={{ headerShown: false }} />
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

    </Stack.Navigator>
  );
}

function Root() {
  const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
  return (<GestureHandlerRootView style={{ flex: 1, backgroundColor: `hsl(${currentTheme?.background})` }}>
    <NavigationContainer>
      <ThemeProvider />
      <Routes />
    </NavigationContainer>
  </GestureHandlerRootView>)

}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
};