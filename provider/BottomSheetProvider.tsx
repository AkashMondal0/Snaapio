import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { memo } from 'react';

const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {

    return <BottomSheetModalProvider>
        {children}
    </BottomSheetModalProvider>
}


export default memo(BottomSheetProvider);