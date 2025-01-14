import React from 'react';
import {
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from 'hyper-native-ui';    

const SkysoloActionSheet = ({
    bottomSheetModalRef,
    snapPoints,
    children,
    handleSheetChanges,
}: {
    children?: React.ReactNode
    tigerComponent?: string
    bottomSheetModalRef: React.RefObject<BottomSheetModal>
    snapPoints: string[]
    handleSheetChanges: (index: number) => void
}) => {
    const { currentTheme } = useTheme();

    return (
        <>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                handleIndicatorStyle={{
                    backgroundColor: currentTheme?.primary,
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
                <BottomSheetScrollView>
                    <BottomSheetView style={{ flex: 1 }}>
                       {children}
                    </BottomSheetView>
                </BottomSheetScrollView>
            </BottomSheetModal>
        </>
    );
};

export default SkysoloActionSheet;