import { memo, useEffect } from "react";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { useTheme } from 'hyper-native-ui';
import { RootState } from "@/redux-stores/store";
import { Appearance, StatusBar } from "react-native";


let loaded = false;

const PreConfiguration = () => {
    const theme = useSelector((state: RootState) => state.AuthState.theme)
    const dispatch = useDispatch();
    const { initialTheme } = useTheme();
    const colorScheme = theme.themeSchema === "system" ? Appearance.getColorScheme() === "dark" : theme.themeSchema === "dark";

    // initialize theme value
    const initialize = useCallback(async () => {
        if (loaded) return;
        loaded = true;
        dispatch(fetchUnreadNotificationCountApi() as any);
    }, []);

    const initializeTheme = useCallback(async () => {
        initialTheme({ colorScheme: theme.themeSchema, themeName: theme.themeName });
    }, [theme]);

    useEffect(() => {
        initializeTheme();
        initialize();
    }, [theme]);

    return <>
        <StatusBar
            translucent
            barStyle={colorScheme ? "light-content" : "dark-content"}
            backgroundColor={"transparent"} />
    </>;
};

export default memo(PreConfiguration);