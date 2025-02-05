import React, { memo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import SelectAssets from '@/components/upload/select-assets';
import { PageProps } from '@/types';
import { useNavigation, StackActions } from '@react-navigation/native';
import { View } from 'react-native';
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
    return <View style={{ flex: 1 }}>
        <SelectAssets nextAction={nextAction} />
    </View>
})

export default AssetSelectScreen;