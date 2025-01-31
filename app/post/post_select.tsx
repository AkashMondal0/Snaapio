import React, { memo, useCallback } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { ThemedView } from "hyper-native-ui";
import { useNavigation } from '@react-navigation/native';

const PostSelectScreen = memo(function PostSelectScreen() {
    const navigation = useNavigation();
    const nextAction = useCallback((selectedAssets: MediaLibrary.Asset[]) => {
        navigation?.navigate("PostUpload" as any, { assets: selectedAssets });
    }, []);

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <SelectAssets nextAction={nextAction} />
        </ThemedView>
    )
})

export default PostSelectScreen;