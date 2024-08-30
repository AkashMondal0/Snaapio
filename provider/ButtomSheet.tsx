import React from 'react';
import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

interface ActionSheetProps {
    children: React.ReactNode;
}

const ButtonSheet = ({ children }: ActionSheetProps) => {

  // renders
  return (
    <BottomSheetModalProvider>
        {children}
    </BottomSheetModalProvider>
  );
};


export default ButtonSheet;