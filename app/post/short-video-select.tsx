import React, { memo, useCallback } from 'react';
import SelectAssets from '@/components/upload/select-assets';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

const ShortVideoSelectScreen = memo(function ShortVideoSelectScreen() {
	const navigation = useNavigation();
	const nextAction = useCallback((selectedAssets: MediaLibrary.Asset[]) => {
		navigation?.navigate("VideoEdit" as any, { assets: selectedAssets })
	}, []);

	return (
		<View style={{
			flex: 1,
			width: '100%',
			height: '100%',
		}}>
			<SelectAssets
				assetsLimit={1}
				nextAction={nextAction}
				mediaType={["video"]} />
		</View>
	)
})

export default ShortVideoSelectScreen;