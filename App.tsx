import * as React from 'react';
import { StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

import { DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { RootState, persistor, store } from '@/redux-stores/store';

import { ThemeProvider, useTheme } from 'hyper-native-ui';
import { AuthNavigation, Navigation } from '@/app/navigation';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import SocketConnections from '@/provider/SocketConnections';
import StripProvider from '@/provider/StripProvider';

import { registerGlobals } from 'react-native-webrtc';

// 🔔 Notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowAlert: true, // updated key (was shouldShowBanner in iOS < 15)
  }),
});

// 🚀 Keep splash screen visible until ready
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 300, fade: true });

// 🌍 Deep linking prefixes
const prefix = Linking.createURL('/');
const prefixes = [prefix, 'snaapio://', 'https://snaapio.vercel.app'];

// 📡 Register WebRTC globals
registerGlobals();

function Root() {
  const { currentTheme, themeScheme } = useTheme();

  // ✅ Memoized session selector for perf
  const session = useSelector(
    (state: RootState) => state.AuthState.session,
    (prev, next) => prev.user === next.user
  );

  // 🎨 Memoized theme object
  const theme = React.useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        background: currentTheme.background,
        border: currentTheme.border,
        card: currentTheme.card,
        notification: currentTheme.destructive,
        primary: currentTheme.primary,
        text: currentTheme.foreground,
      },
    }),
    [currentTheme]
  );

  const onReady = React.useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={themeScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: currentTheme.background }}>
          <SafeAreaProvider style={{ flex: 1, backgroundColor: currentTheme.background }}>
            <PreConfiguration>
              {session.user ? (
                <StripProvider>
                  <BottomSheetProvider>
                    <SocketConnections>
                      <Navigation linking={{ prefixes }} theme={theme} onReady={onReady} />
                    </SocketConnections>
                  </BottomSheetProvider>
                </StripProvider>
              ) : (
                <AuthNavigation linking={{ prefixes }} theme={theme} onReady={onReady} />
              )}
            </PreConfiguration>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </>
  );
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
}
