import React, { memo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import SelectAssets from '@/components/upload/select-assets';
import {
    PageProps
} from '@/types';

const AssetSelectScreen = memo(function AssetSelectScreen({
    navigation,
    route,
}: PageProps<any>) {
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.replace('message/asset/review', {
            assets: selectedAssets,
            conversation: route?.params.conversation
        });
    };
    return <SelectAssets navigation={navigation} nextAction={nextAction} />
})

export default AssetSelectScreen;