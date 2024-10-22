import React, { memo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import SelectAssets from '@/components/upload/select-assets';
import {
    PageProps
} from '@/types';
import { View as ThemedView } from '@/components/skysolo-ui';

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
    return <ThemedView style={{ flex: 1 }}>
        <SelectAssets navigation={navigation} nextAction={nextAction} />
    </ThemedView>
})

export default AssetSelectScreen;