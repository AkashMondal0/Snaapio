import React, { memo } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { PageProps } from '@/types';
import { ThemedView } from '@/components/skysolo-ui';

const StorySelectingScreen = memo(function StorySelectingScreen({
    navigation,
}: PageProps<any>) {
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.navigate('story/upload', { assets: selectedAssets });
    };
    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <SelectAssets navigation={navigation} nextAction={nextAction} assetsLimit={1}/>
        </ThemedView>
    )
})

export default StorySelectingScreen;