export type Theme = "light" | "dark" | "system";
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { changeColorSchema, setThemeLoaded } from "@/redux-stores/slice/theme";
import { StatusBar, Appearance } from 'react-native';
import { localStorage } from '@/lib/LocalStorage';
import { ThemeNames } from '@/components/skysolo-ui/colors';

const ThemeProvider = () => {
    const dispatch = useDispatch()
    const themeLoaded = useSelector((state: RootState) => state.ThemeState.themeLoaded, (prev, next) => prev === next)
    const themeSchema = useSelector((state: RootState) => state.ThemeState.themeSchema, (prev, next) => prev === next)



    const GetLocalStorageThemeValue = useCallback(async () => {
        const localValueSchema = await localStorage("get", "skysolo-theme") as Theme
        const localValueTheme = await localStorage("get", "skysolo-theme-name") as ThemeNames
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
    }, [themeLoaded])

    const onChangeTheme = useCallback(async (theme: Theme) => {
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
    }, [])

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


    return <StatusBar barStyle={themeSchema === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent"
        translucent={true} />
}


export default ThemeProvider;