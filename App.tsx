import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/redux-stores/store';
import PreConfiguration from '@/provider/PreConfiguration';
import BottomSheetProvider from '@/provider/BottomSheetProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SocketConnections from '@/provider/SocketConnections';
import { ThemeProvider, useTheme } from 'hyper-native-ui';
import { Appearance, StatusBar } from 'react-native';
import { AuthNavigation, Navigation } from '@/app/navigation';
import * as Linking from 'expo-linking';

SplashScreen.preventAutoHideAsync();
const prefix = Linking.createURL('/');

function Root() {
  const themeColorSchema = Appearance.getColorScheme() === "dark";
  const { currentTheme, themeScheme } = useTheme();
  const session = useSelector((state: RootState) => state.AuthState.session);
  const background = currentTheme.background ? currentTheme.background : themeColorSchema ? "#000" : "#fff";
  const barStyle = currentTheme.background ? themeScheme === "dark" ? "light-content" : "dark-content" : themeColorSchema ? "light-content" : "dark-content";
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
  }
  return (<>
    <StatusBar translucent backgroundColor={"transparent"}
      barStyle={barStyle} />
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <SafeAreaProvider style={{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: background,
      }}>
        <SocketConnections >
          <PreConfiguration />
          <BottomSheetProvider>
            {session.user ? <Navigation theme={theme} linking={{
              prefixes: [prefix, 'snaapio://', 'https://snaapio.vercel.app'],
            }} /> : <AuthNavigation theme={theme} />}
          </BottomSheetProvider>
        </SocketConnections>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  </>)

}

export default function App() {

  return (
    <>
      <ThemeProvider enableThemedStatusBar>
        <Provider store={store}>
          <Root />
        </Provider>
      </ThemeProvider>
    </>
  );
};