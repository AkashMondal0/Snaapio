import { memo, useEffect } from "react";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { useTheme } from 'hyper-native-ui';
import { RootState } from "@/redux-stores/store";


let loaded = false;

const PreConfiguration = () => {
    const theme = useSelector((state: RootState) => state.AuthState.theme)
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const dispatch = useDispatch();
    const { initialTheme } = useTheme();
    // initialize theme value
    const initialize = useCallback(async () => {
        if (!loaded && session) {
            loaded = true;
            dispatch(fetchUnreadNotificationCountApi() as any);
        }
    }, []);

    const initializeTheme = useCallback(async () => {
        initialTheme({ colorScheme: theme.themeSchema, themeName: theme.themeName });
    }, [theme]);

    useEffect(() => {
        initializeTheme();
        initialize();
    }, [theme]);

    return <>
    </>;
};

export default memo(PreConfiguration);