import React, { memo } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { PageProps } from '@/types';
import { ThemedView } from '@/components/skysolo-ui';

const NewPostSelectionScreen = memo(function NewPostSelectionScreen({
    navigation,
}: PageProps<any>) {
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.navigate('upload/post/review', { assets: selectedAssets });
    };
    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <SelectAssets navigation={navigation} nextAction={nextAction} />
        </ThemedView>
    )
})

export default NewPostSelectionScreen;