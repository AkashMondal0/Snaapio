import React, { useCallback } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { Appearance } from 'react-native';
import { localStorage } from '@/lib/LocalStorage';
import { getSecureStorage } from '@/lib/SecureStore';
import { setSession } from '@/redux-stores/slice/auth';
import { Session } from '@/types';
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { configs } from '@/configs';
import { useTheme, StatusBar, ThemeSchemaType } from "hyper-native-ui";


const PreConfiguration = () => {
    const dispatch = useDispatch();
    const { setInitialTheme, toggleTheme, themeScheme } = useTheme();
    const loaded = useSelector((state: RootState) => state.AuthState.loaded, (pre, next) => pre === next);

    const delayFunction = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        SplashScreen.hideAsync();
    }, [])

    // initialize theme value
    const initialize = useCallback(async () => {
        if (loaded) return
        const p1 = localStorage("get", configs.themeSchema) as any;
        const p2 = localStorage("get", configs.themeName) as any;
        const p3 = getSecureStorage<Session["user"]>(configs.sessionName);
        const data = await Promise.all([p1, p2, p3])
        
        if (data[0] && data[1]) {
            setInitialTheme({ themeSchema: data[0], themeName: data[1] });
        }
        delayFunction();
        if (data[2]) {
            dispatch(setSession(data[2]));
            dispatch(fetchUnreadNotificationCountApi() as any);
        }
        return;
    }, [loaded])

    const onValueChange = useCallback(async (value: ThemeSchemaType) => {
        try {
            if (themeScheme === value) return;
            await localStorage("set", configs.themeSchema, value);
            toggleTheme();
        } catch (error) {
            console.error("Error in setting theme", error);
        }
    }, [themeScheme])

    useEffect(() => {
        initialize();
        const unSubscribe = Appearance.addChangeListener(({ colorScheme }) => {
            onValueChange(colorScheme as ThemeSchemaType)
        })

        return () => { unSubscribe.remove(); }
    }, [themeScheme])

    return (<StatusBar />)
}

export default PreConfiguration;