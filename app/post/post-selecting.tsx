import React, { memo, useCallback } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { StackActions, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

const PostSelectScreen = memo(function PostSelectScreen() {
    const navigation = useNavigation();
    const nextAction = useCallback((selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.dispatch(StackActions.replace("PostUpload" as any, { assets: selectedAssets }));
    }, []);

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <SelectAssets nextAction={nextAction} />
        </View>
    )
})

export default PostSelectScreen;