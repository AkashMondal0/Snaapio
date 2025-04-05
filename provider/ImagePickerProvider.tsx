import BottomSheet from "@gorhom/bottom-sheet";
import { createContext, memo, useCallback, useRef } from "react";

export const ImagePickerContext = createContext<{
  sheetRef: BottomSheet | null | any,
  handleSheetChange: (index: number) => void,
  handleSnapPress: (index: number) => void,
  handleClosePress: () => void,
}>({
  sheetRef: null,
  handleSheetChange: () => { },
  handleSnapPress: () => { },
  handleClosePress: () => { },
});

const ImagePickerProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return <ImagePickerContext.Provider value={{
    handleSheetChange,
    handleSnapPress,
    handleClosePress,
    sheetRef
  }}>
    {children}
  </ImagePickerContext.Provider>
}

export default memo(ImagePickerProvider);