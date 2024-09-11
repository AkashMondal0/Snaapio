import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import * as SplashScreen from 'expo-splash-screen';
import ThemeProvider from '@/provider/ThemeProvider'
import { SettingScreen, ThemeSettingScreen } from '@/app/setting';
import { HomeScreen, CameraScreen, MessageScreen } from '@/app/home';
import { TabView, SceneMap } from 'react-native-tab-view';
import { tabChange } from '@/redux-stores/slice/theme';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();


export function TopTabBar() {
  const tabIndex = useSelector((state: RootState) => state.ThemeState.tabIndex, (prev, next) => prev === next)
  const dispatch = useDispatch()

  return (
    <TabView
      navigationState={{
        index: tabIndex, routes: [
          { key: 'camera', title: 'camera' },
          { key: 'home', title: 'home' },
          { key: 'message', title: 'message' },
        ]
      }}
      renderScene={SceneMap({
        camera: CameraScreen,
        home: HomeScreen,
        message: MessageScreen,
      })}
      renderTabBar={() => null}
      onIndexChange={(e) => { dispatch(tabChange(e)) }} />
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

    </Stack.Navigator>
  );
}

function Root() {
  const background = useSelector((state: RootState) => state.ThemeState.currentTheme?.background, (prev, next) => prev === next)
  return (<GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
    <NavigationContainer>
      <BottomSheetProvider>
        <ThemeProvider />
        <Routes />
      </BottomSheetProvider>
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