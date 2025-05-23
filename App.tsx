import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, persistor, store } from '@/redux-stores/store';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SocketConnections from '@/provider/SocketConnections';
import { ThemeProvider, useTheme } from 'hyper-native-ui';
import { AuthNavigation, Navigation } from '@/app/navigation';
import * as Linking from 'expo-linking';
import { PersistGate } from 'redux-persist/integration/react';
import { registerGlobals } from 'react-native-webrtc';
import StripProvider from './provider/StripProvider';
import { StatusBar } from 'react-native';
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }) as any,
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

// Register global WebRTC API for better compatibility
registerGlobals();
const prefix = Linking.createURL('/');
const prefixes = [prefix, 'snaapio://', 'https://snaapio.vercel.app'];

function Root() {
  const { currentTheme, themeScheme } = useTheme();
  const session = useSelector((state: RootState) => state.AuthState.session, (pre, next) => pre.user === next.user);

  const background = currentTheme.background;
  const theme: any = {
    ...DefaultTheme,
    colors: {
      background: background,
      border: currentTheme.border,
      card: currentTheme.card,
      notification: currentTheme.destructive,
      primary: currentTheme.primary,
      text: currentTheme.foreground
    }
  };

  return (<>
    <StatusBar barStyle={themeScheme === "dark" ? "light-content" : "dark-content"} />
    <KeyboardProvider>
      <GestureHandlerRootView style={{
        flex: 1,
        backgroundColor: background,
      }}>
        <SafeAreaProvider style={{
          flex: 1,
          backgroundColor: background
        }}>
          <PreConfiguration>
            <StripProvider>
              {session.user ? <>
                <BottomSheetProvider>
                  <SocketConnections>
                    <Navigation
                      onReady={() => { SplashScreen.hide() }}
                      theme={theme} linking={{ prefixes }} />
                  </SocketConnections>
                </BottomSheetProvider>
              </> :
                <AuthNavigation
                  onReady={() => { SplashScreen.hide() }}
                  theme={theme} linking={{ prefixes }} />
              }
            </StripProvider>
          </PreConfiguration>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </KeyboardProvider>
  </>)
}

export default function App() {

  return (
    <ThemeProvider enableThemedStatusBar>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};