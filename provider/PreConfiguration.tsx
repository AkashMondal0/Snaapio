import { useEffect } from "react";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import * as SplashScreen from 'expo-splash-screen';
import { Session } from '@/types';
import { configs } from '@/configs';
import { localStorage } from '@/lib/LocalStorage';
import { getSecureStorage } from '@/lib/SecureStore';
import { setSession } from '@/redux-stores/slice/auth';
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { useTheme } from 'hyper-native-ui';

let loaded = false;

const PreConfiguration = () => {
    const dispatch = useDispatch();
    const { initialTheme } = useTheme();

    const delayFunction = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        SplashScreen.hideAsync();
    }, [])

    // initialize theme value
    const initialize = useCallback(async () => {
        try {
            if (loaded) return;
            loaded = true;
            const p1 = localStorage("get", configs.themeSchema) as any;
            const p2 = localStorage("get", configs.themeName) as any;
            const p3 = getSecureStorage<Session["user"]>(configs.sessionName);
            const data = await Promise.all([p1, p2, p3])

            // console.log(data[0], data[1])
            if (!data[0] || !data[1]) {
                await localStorage("set", configs.themeSchema, "system") as any;
                await localStorage("set", configs.themeName, "Zinc") as any;
            }
            else {
                initialTheme({ colorScheme: data[0], themeName: data[1] });
            }
            if (data[2]) {
                dispatch(setSession(data[2]));
                dispatch(fetchUnreadNotificationCountApi() as any);
            }
            return;
        }
        finally {
            delayFunction();
        }
    }, [])

    useEffect(() => {
        initialize();
    }, [])

    return <></>
}

export default PreConfiguration;