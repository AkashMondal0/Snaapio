import React from 'react';
import { Text, Button } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';

const ChatDetailsSheet = ({
    bottomSheetModalRef,
    snapPoints,
    handleSheetChanges,
}: {
    children?: React.ReactNode
    tigerComponent?: string
    bottomSheetModalRef: React.RefObject<BottomSheetModal>
    snapPoints: string[]
    handleSheetChanges: (index: number) => void
}) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return (
        <>
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
                style={{
                    elevation: 10,
                }}
                onChange={handleSheetChanges}>
                <BottomSheetView style={{ flex: 1 }}>
                    <Text>Awesome 🎉</Text>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
};

export default ChatDetailsSheet;