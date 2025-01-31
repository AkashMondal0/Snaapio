import React, { memo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import SelectAssets from '@/components/upload/select-assets';
import { PageProps } from '@/types';
import { ThemedView } from 'hyper-native-ui';
import { useNavigation, StackActions } from '@react-navigation/native';
const AssetSelectScreen = memo(function AssetSelectScreen({
    route,
}: PageProps<any>) {
    const navigation = useNavigation()
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        navigation.dispatch(
            StackActions.replace("MessageUploadFile", {
                assets: selectedAssets,
                conversation: route?.params.conversation
            }));
    };
    return <ThemedView style={{ flex: 1 }}>
        <SelectAssets nextAction={nextAction} />
    </ThemedView>
})

export default AssetSelectScreen;