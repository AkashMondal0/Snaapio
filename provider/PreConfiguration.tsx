import { memo, useEffect } from "react";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
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

    // initialize theme value
    const initialize = useCallback(async () => {
        try {
            const p1 = getSecureStorage<ThemeSchemaType>(configs.themeSchema, "string")
            const p2 = getSecureStorage<ThemeNameType>(configs.themeName, "string")
            const p3 = getSecureStorage<Session["user"]>(configs.sessionName);
            const data = await Promise.all([p1, p2, p3])

            if (!data[0] || !data[1]) {
                await setSecureStorage(configs.themeSchema, "system");
                await setSecureStorage(configs.themeName, "Zinc");
            }
            else {
                initialTheme({ colorScheme: data[0], themeName: data[1] });
            }
            if (data[2]) {
                dispatch(fetchUnreadNotificationCountApi() as any);
                dispatch(setSession(data[2]));
            } else {
                dispatch(setSession(null));
            }
        }
        catch (e: any) {
            console.error(e)
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

export default memo(PreConfiguration);