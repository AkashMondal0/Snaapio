import { useEffect } from "react";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import * as SplashScreen from 'expo-splash-screen';
import { Session } from '@/types';
import { configs } from '@/configs';
import { getSecureStorage, setSecureStorage } from '@/lib/SecureStore';
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { setSession } from '@/redux-stores/slice/auth';
import { useTheme, ThemeNameType, ThemeSchemaType } from 'hyper-native-ui';
let loaded = false;

const PreConfiguration = () => {
    const dispatch = useDispatch();
    const { initialTheme } = useTheme();

    const delayFunction = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        SplashScreen.hideAsync();
    }, []);

    // initialize theme value
    const initialize = useCallback(async () => {
        try {
            const p1 = getSecureStorage<ThemeSchemaType>(configs.themeSchema,"string")
            const p2 = getSecureStorage<ThemeNameType>(configs.themeName,"string")
            const p3 = getSecureStorage<Session["user"]>(configs.sessionName);
            const data = await Promise.all([p1, p2, p3])

            // console.log(data[0], data[1], data[2])
            if (!data[0] || !data[1]) {
                await setSecureStorage(configs.themeSchema, "system");
                await setSecureStorage(configs.themeName, "Zinc");
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
    }, []);

    useEffect(() => {
        if (!loaded) {
            loaded = true;
            initialize();
        };
    }, []);

    return <></>;
};

export default PreConfiguration;