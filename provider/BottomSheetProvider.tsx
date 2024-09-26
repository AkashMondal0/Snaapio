import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {

    return <BottomSheetModalProvider>
        {children}
    </BottomSheetModalProvider>
}


export default BottomSheetProvider;