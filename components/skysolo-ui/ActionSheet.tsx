import React, { useCallback, useMemo, useRef } from 'react';
import { Text, Button } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';

const SkysoloActionSheet = () => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ['50%', "90%"], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        // console.log('handleSheetChanges', index);
    }, []);

    // renders
    return (
        <>
         <Button
                onPress={handlePresentModalPress}
                title="Present Modal"
                color="black"
            />
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                handleIndicatorStyle={{
                    backgroundColor: currentTheme?.secondary_foreground,
                }}
                backgroundStyle={{
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30,
                    backgroundColor: currentTheme?.secondary,
                }}
                onChange={handleSheetChanges}>
                <BottomSheetView style={{ flex: 1 }}>
                    <Text>Awesome 🎉</Text>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
};

export default SkysoloActionSheet;