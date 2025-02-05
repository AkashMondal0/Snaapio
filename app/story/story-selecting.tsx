import React, { memo } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

const StorySelectingScreen = memo(function StorySelectingScreen() {
    const navigation = useNavigation();
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.navigate("StoryUpload" as any, { assets: selectedAssets });
    };
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <SelectAssets nextAction={nextAction} assetsLimit={1} />
        </View>
    )
})

export default StorySelectingScreen;