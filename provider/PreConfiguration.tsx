import { useEffect } from "react";
import { Session } from '@/types';
import { configs } from '@/configs';
import { useDispatch } from "react-redux";
import React, { useCallback } from "react";
import { localStorage } from '@/lib/LocalStorage';
import { getSecureStorage } from '@/lib/SecureStore';
import * as SplashScreen from 'expo-splash-screen';
import { setSession } from '@/redux-stores/slice/auth';
import { useTheme } from "hyper-native-ui";
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
let loaded = false;

const PreConfiguration = () => {
    const dispatch = useDispatch();
    const { setInitialTheme } = useTheme();

    const delayFunction = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        SplashScreen.hideAsync();
    }, [])

    // initialize theme value
    const initialize = useCallback(async () => {
        if (loaded) return;
        loaded = true;
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
    }, [])

    useEffect(() => {
        initialize();
    }, [])

    return <></>
}

export default PreConfiguration;