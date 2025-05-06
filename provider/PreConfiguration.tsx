import { createContext, memo, ReactNode, useEffect, useRef } from "react";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadNotificationCountApi } from '@/redux-stores/slice/notification/api.service';
import { useTheme } from 'hyper-native-ui';
import { RootState } from "@/redux-stores/store";
import Share_Sheet from "@/components/buttom-sheet/share-sheet";
import BottomSheet from "@gorhom/bottom-sheet";

export interface AppContextType {
    handleSnapPress: (index: number) => void
}
export const AppContext = createContext<AppContextType>({
    handleSnapPress: () => { }
});
let loaded = false;

const PreConfiguration = ({
    children
}: {
    children: ReactNode
}) => {
    const { initialTheme } = useTheme();
    const theme = useSelector((state: RootState) => state.AuthState.theme)
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const sheetRef = useRef<BottomSheet>(null);
    const dispatch = useDispatch();

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

    const handleSnapPress = useCallback((index: any) => {
        sheetRef.current?.snapToIndex(index);
    }, []);

    useEffect(() => {
        initializeTheme();
        initialize();
    }, [theme]);

    return <AppContext.Provider value={{
        handleSnapPress
    }}>
        {children}
        <Share_Sheet sheetRef={sheetRef}/>
    </AppContext.Provider>
};

export default memo(PreConfiguration);