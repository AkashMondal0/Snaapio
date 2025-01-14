import React from "react";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { changeColorSchema, setThemeLoaded } from "@/redux-stores/slice/theme";
import { Appearance } from 'react-native';
import { localStorage } from '@/lib/LocalStorage';
import { ThemeNames, ThemeSchema } from '@/components/skysolo-ui/colors';
import { getSecureStorage } from '@/lib/SecureStore';
import { setSession } from '@/redux-stores/slice/auth';
import { Session } from '@/types';
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { configs } from '@/configs';
import { StatusBar } from "hyper-native-ui";


const PreConfiguration = () => {
    const dispatch = useDispatch()
    const themeLoaded = useSelector((state: RootState) => state.ThemeState.themeLoaded, (prev, next) => prev === next);
    const initializeSession = async () => {
        const session = await getSecureStorage<Session["user"]>(configs.sessionName)
        if (session) {
            dispatch(setSession(session))
            dispatch(fetchUnreadNotificationCountApi() as any)
        }
    }
    // initialize theme value
    const initializeTheme = async () => {
        await initializeSession()
        if (themeLoaded) return
        const localValueSchema = await localStorage("get", "skysolo-theme") as ThemeSchema
        const localValueTheme = await localStorage("get", "skysolo-theme-name") as ThemeNames
        // first time
        if (!localValueSchema || !localValueTheme) {
            dispatch(setThemeLoaded({
                userThemeName: "Zinc",
                userColorScheme: "light"
            }))
            localStorage("set", "skysolo-theme", "light")
            localStorage("set", "skysolo-theme-name", "Zinc")
            return
        }

        dispatch(setThemeLoaded({
            userThemeName: localValueTheme,
            userColorScheme: localValueSchema
        }))
        return
    }

    const onChangeThemeSchema = async (theme: ThemeSchema) => {
        if (!theme) return
        dispatch(changeColorSchema(theme))
        localStorage("set", "skysolo-theme", theme)
        return
    }

    useEffect(() => {
        if (themeLoaded) {
            SplashScreen.hideAsync()
        }
    }, [themeLoaded])

    useEffect(() => {
        initializeTheme()
        const unSubscribe = Appearance.addChangeListener(({ colorScheme }) => {
            onChangeThemeSchema(colorScheme as any)
        })

        return () => {
            unSubscribe.remove()
        }
    }, [])

    return (<StatusBar />)
}

export default PreConfiguration;