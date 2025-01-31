import React, { memo } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { ThemedView } from 'hyper-native-ui';
import { useNavigation } from '@react-navigation/native';

const StorySelectingScreen = memo(function StorySelectingScreen() {
    const navigation = useNavigation();
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.navigate("StoryUpload" as any, { assets: selectedAssets });
    };
    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <SelectAssets nextAction={nextAction} assetsLimit={1} />
        </ThemedView>
    )
})

export default StorySelectingScreen;