import React, { memo } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { PageProps } from '@/types';

const NewPostSelectionScreen = memo(function NewPostSelectionScreen({
    navigation,
}: PageProps<any>) {
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.navigate('upload/post/review', { assets: selectedAssets });
    };
    return <SelectAssets navigation={navigation} nextAction={nextAction} />
})

export default NewPostSelectionScreen;