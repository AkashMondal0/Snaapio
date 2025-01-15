import React, { useCallback } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
// import { Appearance } from 'react-native';
// import { localStorage } from '@/lib/LocalStorage';
import { getSecureStorage } from '@/lib/SecureStore';
import { setSession } from '@/redux-stores/slice/auth';
import { Session } from '@/types';
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { configs } from '@/configs';
import { StatusBar } from "hyper-native-ui";


const PreConfiguration = () => {
    const dispatch = useDispatch()
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const initializeSession = async () => {
        const session = await getSecureStorage<Session["user"]>(configs.sessionName)
        if (session) {
            dispatch(setSession(session))
            dispatch(fetchUnreadNotificationCountApi() as any)
        }
    }
    // initialize theme value
    // const initializeTheme = async () => {
    // await initializeSession()
    // if (themeLoaded) return
    // const localValueSchema = await localStorage("get", "skysolo-theme") as ThemeSchema
    // const localValueTheme = await localStorage("get", "skysolo-theme-name") as ThemeNames
    // // first time
    // if (!localValueSchema || !localValueTheme) {
    //     dispatch(setThemeLoaded({
    //         userThemeName: "Zinc",
    //         userColorScheme: "light"
    //     }))
    //     localStorage("set", "skysolo-theme", "light")
    //     localStorage("set", "skysolo-theme-name", "Zinc")
    // return
    // }

    // dispatch(setThemeLoaded({
    //     userThemeName: localValueTheme,
    //     userColorScheme: localValueSchema
    // }))
    // return
    // }

    // useEffect(() => {
    //     if (themeLoaded) {
    //         SplashScreen.hideAsync()
    //     }
    // }, [themeLoaded])

    // useEffect(() => {
    //     initializeTheme()
    //     const unSubscribe = Appearance.addChangeListener(({ colorScheme }) => {
    //         // onChangeThemeSchema(colorScheme as any)
    //     })

    //     return () => {
    //         unSubscribe.remove()
    //     }
    // }, [])

    const delayFunc = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        SplashScreen.hideAsync()
    }, [])

    useEffect(() => {
        initializeSession()
        if (session?.id) {
            delayFunc()
        }
    }, [session?.id])

    return (<StatusBar />)
}

export default PreConfiguration;