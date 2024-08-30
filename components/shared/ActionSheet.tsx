import React, { useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';

interface ActionSheetProps {
  BottomSheetComponent?: React.ReactNode;
  handleSheetChanges?: (index: number) => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
}

const ActionSheet = ({
  BottomSheetComponent,
  handleSheetChanges,
  bottomSheetModalRef,
  snapPoints }: ActionSheetProps) => {
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
  const [isModalVisible, setModalVisible] = useState(-1);

  // renders
  return (
    <>
      {isModalVisible !==-1 ? <TouchableOpacity
        activeOpacity={1}
        onPress={() => bottomSheetModalRef.current?.dismiss()}
        style={{
          flex: 1,
          justifyContent: 'center',
          // backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          position: 'absolute',
          zIndex: 100,
          width: '100%',
          height: '100%',
        }}>
      </TouchableOpacity> : <></>}
      <BottomSheetModal
        backgroundStyle={{
          backgroundColor: useTheme.primaryBackground,
          borderRadius: 30
        }}
        handleIndicatorStyle={{
          backgroundColor: useTheme.primary
        }}
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={(e) => {
          setModalVisible(e)
        }}>
        {BottomSheetComponent}
      </BottomSheetModal>
    </>
  );
};

export default ActionSheet;