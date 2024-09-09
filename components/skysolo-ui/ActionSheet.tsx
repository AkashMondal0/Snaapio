import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
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
        <BottomSheetModalProvider>
            <View style={{
                flex: 1,
                padding: 24,
                justifyContent: 'center',
            }}>
                <Button
                    onPress={handlePresentModalPress}
                    title="Present Modal"
                    color="black"
                />
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    handleComponent={() => null}
                    onChange={handleSheetChanges}>
                    <BottomSheetView style={{
                        backgroundColor: currentTheme?.secondary,
                        flex: 1,
                        borderRadius: 20,
                    }}>
                        <Text>Awesome 🎉</Text>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
};

export default SkysoloActionSheet;