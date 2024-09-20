import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { changeColorSchema, setThemeLoaded } from "@/redux-stores/slice/theme";
import { StatusBar, Appearance } from 'react-native';
import { localStorage } from '@/lib/LocalStorage';
import { ThemeNames } from '@/components/skysolo-ui/colors';
import { View } from '@/components/skysolo-ui';
import { SecureStorage } from '@/lib/SecureStore';
import { setSession } from '@/redux-stores/slice/auth';
import { Session } from '@/types';

export type Theme = "light" | "dark" | "system";


const PreConfiguration = () => {
    const dispatch = useDispatch()
    const themeLoaded = useSelector((state: RootState) => state.ThemeState.themeLoaded, (prev, next) => prev === next)
    const themeSchema = useSelector((state: RootState) => state.ThemeState.themeSchema, (prev, next) => prev === next)

    const GetLocalStorageThemeValue = async () => {
        const localValueSchema = await localStorage("get", "skysolo-theme") as Theme
        const localValueTheme = await localStorage("get", "skysolo-theme-name") as ThemeNames
        const session = await SecureStorage("get", "skylight-session") as Session | any
        if (session) {
            dispatch(setSession(session))
        }
        // first time
        if (!localValueSchema && !localValueTheme) {
            await localStorage("set", "skysolo-theme", "light")
            await localStorage("set", "skysolo-theme-name", "Zinc")
            dispatch(setThemeLoaded({
                userThemeName: localValueTheme ?? "Zinc",
                userColorScheme: localValueSchema ?? "light"
            }))
            return
        }
        // if system theme is selected
        if (localValueSchema === "system") {
            return
        }
        dispatch(setThemeLoaded({
            userThemeName: localValueTheme ?? "Zinc",
            userColorScheme: localValueSchema ?? "light"
        }))
        return
    }

    const onChangeTheme = async (theme: Theme) => {
        if (!theme) return console.error("Theme is not defined")
        if (theme === "system") {
            await localStorage("remove", "skysolo-theme")
            await localStorage("remove", "skysolo-theme-name")
            return
        }
        // console.log("changing Theme", theme)
        await localStorage("set", "skysolo-theme", theme)
        await localStorage("set", "skysolo-theme-name", "Zinc")
        dispatch(changeColorSchema(theme))
        return
    }

    useEffect(() => {
        if (themeLoaded) {
            SplashScreen.hideAsync()
        }
    }, [themeLoaded])

    useEffect(() => {
        GetLocalStorageThemeValue()
        Appearance.addChangeListener(({ colorScheme }) => {
            onChangeTheme(colorScheme as any)
        })
    }, [])

    if (!themeLoaded) return <></>


    return <>
        <StatusBar barStyle={themeSchema === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent"
            translucent={true} />
        <View style={{
            height: StatusBar.currentHeight,
            width: "100%"
        }} />
    </>
}


export default PreConfiguration;