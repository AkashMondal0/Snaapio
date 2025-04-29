import React, { memo, useCallback } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

const ShortVideoUploadScreen = memo(function ShortVideoUploadScreen() {
    const navigation = useNavigation();
    const nextAction = useCallback((selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.navigate("PostUpload" as any, { assets: selectedAssets })
    }, []);

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <SelectAssets nextAction={nextAction} />
        </View>
    )
})

export default ShortVideoUploadScreen;