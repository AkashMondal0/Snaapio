import React, { memo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import SelectAssets from '@/components/upload/select-assets';
import { PageProps } from '@/types';
import { useNavigation, StackActions } from '@react-navigation/native';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { selectGlobalAssets } from '@/redux-stores/slice/account';

const PickupImages = memo(function PickupImages({
    route,
}: PageProps<{
    redirectPage: string
}>) {
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const nextAction = (selectedAssets: MediaLibrary.Asset[]) => {
        if (route?.params?.redirectPage) {
            navigation.dispatch(
                StackActions.replace(route?.params?.redirectPage, {
                    assets: selectedAssets,
                }));
        } else {
            dispatch(selectGlobalAssets(selectedAssets));
            if (navigation.canGoBack()) {
                navigation.goBack();
            };
        };
    };
    return <View style={{ flex: 1 }}>
        <SelectAssets nextAction={nextAction} assetsLimit={1} />
    </View>
})

export default PickupImages;