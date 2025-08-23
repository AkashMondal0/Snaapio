import React, {
  createContext,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomSheet from "@gorhom/bottom-sheet";

import { fetchUnreadNotificationCountApi } from "@/redux-stores/slice/notification/api.service";
import { RootState } from "@/redux-stores/store";
import { useTheme } from "hyper-native-ui";
import Share_Sheet from "@/components/buttom-sheet/share-sheet";

export interface AppContextType {
  handleSnapPress: (index: number) => void;
}

export const AppContext = createContext<AppContextType>({
  handleSnapPress: () => {},
});

const PreConfiguration = ({ children }: { children: ReactNode }) => {
  const { initialTheme } = useTheme();
  const theme = useSelector((state: RootState) => state.AuthState.theme);
  const session = useSelector(
    (state: RootState) => state.AuthState.session.user
  );

  const sheetRef = useRef<BottomSheet>(null);
  const initialized = useRef(false);
  const dispatch = useDispatch();

  // 🎨 Initialize theme
  const initializeTheme = useCallback(() => {
    initialTheme({
      colorScheme: theme.themeSchema,
      themeName: theme.themeName,
    });
  }, [initialTheme, theme]);

  // 🔔 Initialize notifications (only once per session)
  const initializeNotifications = useCallback(() => {
    if (!initialized.current && session) {
      initialized.current = true;
      dispatch(fetchUnreadNotificationCountApi() as any);
    }
  }, [dispatch, session]);

  // 📌 Handle BottomSheet actions
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  // 🔄 Effects
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  // ✅ Memoized context to prevent re-renders
  const contextValue = useMemo(
    () => ({ handleSnapPress }),
    [handleSnapPress]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <Share_Sheet sheetRef={sheetRef} />
    </AppContext.Provider>
  );
};

export default memo(PreConfiguration);
