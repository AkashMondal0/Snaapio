import React, { useCallback, useRef, useMemo, useState, useEffect, useContext, ReactNode } from "react";
import { View, ToastAndroid } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import * as MediaLibrary from 'expo-media-library';
import throttle from "@/lib/throttling";
import AppPermissionDialog from "@/components/dialogs/app-permission";
import PhotosPermissionRequester from "@/components/upload/no-permission";
import { setDeviceAssets } from "@/redux-stores/slice/account";
import ImageItem from "@/components/upload/image";
import { ImagePickerContext } from "@/provider/ImagePickerProvider";
import { useTheme } from "hyper-native-ui";
let loaded = false;
let assetsLimit = 5;
const ImagePickerComponent = ({ children }: {
	children: ReactNode
}) => {
	const ImagePickerState = useContext(ImagePickerContext);
	const [permission, requestPermission] = MediaLibrary.usePermissions();
	const media = useSelector((state: RootState) => state.AccountState.deviceAssets);
	const selectedAssets = useRef<MediaLibrary.Asset[]>([]);
	const totalCount = useRef(media.length);
	const [selectedCount, setSelectedCount] = useState(0);
	const dispatch = useDispatch();
	const { currentTheme } = useTheme();

	const snapPoints = useMemo(() => ["1%", "60%", "98%"], []);
	const alertMessage = throttle(() => {
		ToastAndroid.show(`You can select up to images`, ToastAndroid.LONG);
	}, 5000);

	const getMediaPermission = useCallback(async () => {
		if (!permission) return
		const rePermission = await requestPermission();
		if (!rePermission.granted) {
			return;
		}
		return rePermission;
	}, [permission]);

	const fetchMediaPagination = useCallback(async () => {
		const {
			assets: mediaResult,
			endCursor,
			hasNextPage,
			totalCount: totalMediaCount,
		} = await MediaLibrary.getAssetsAsync({
			mediaType: ['photo'],
			first: 20,
			sortBy: MediaLibrary.SortBy.default,
			after: totalCount.current.toString(),
		});

		if (totalCount.current < totalMediaCount) {
			totalCount.current = Number(endCursor);
			dispatch(setDeviceAssets(mediaResult));
		}
	}, [totalCount.current]);

	const throttledFunction = throttle(() => fetchMediaPagination(), 1000);

	const onPressAssetHandle = useCallback((assets: MediaLibrary.Asset) => {
		const index = selectedAssets.current.findIndex(asset => asset.id === assets.id);
		if (selectedAssets.current.length >= assetsLimit && index === -1) {
			return alertMessage();
		}
		if (index === -1) {
			selectedAssets.current.push(assets);
			setSelectedCount((prev) => prev + 1);
		} else {
			selectedAssets.current.splice(index, 1);
			setSelectedCount((prev) => prev - 1);
		}
	}, [selectedAssets.current, selectedCount]);

	const onEndReached = useCallback(() => {
		if (totalCount.current > 10) {
			throttledFunction();
		}
	}, [totalCount.current]);

	useEffect(() => {
		if (!loaded && permission?.granted && media.length >= 0) {
			getMediaPermission();
			fetchMediaPagination();
		}
	}, [permission?.granted]);

	// render
	const renderItem = useCallback(
		({ item }: any) => (
			<ImageItem
				item={item}
				selectAssetIndex={selectedAssets.current.findIndex(asset => asset.id === item.id)}
				onPressAssetHandle={onPressAssetHandle} />
		),
		[]
	);


	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			{children}
			<BottomSheet
				index={0}
				ref={ImagePickerState.sheetRef}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				backgroundStyle={{
					backgroundColor: currentTheme.card,
					borderWidth: 0.6,
					borderColor: currentTheme.input,
					borderRadius: 26
				}}
				handleIndicatorStyle={{
					backgroundColor: currentTheme.card_foreground
				}}
				onChange={ImagePickerState.handleSheetChange}
				onClose={() => ImagePickerState.handleClosePress()}
			>
				<BottomSheetFlatList
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					data={media}
					keyExtractor={(i) => i.id}
					numColumns={3}
					columnWrapperStyle={{
						gap: 2,
						paddingVertical: 1,
					}}
					ListEmptyComponent={() => {
						if (!permission) {
							// Permission request is in progress
							return <View />;
						}

						if (!permission.granted) {
							// Permission was denied
							return <>
								<AppPermissionDialog confirm={getMediaPermission} />
								<PhotosPermissionRequester permission={permission} />
							</>
						}
					}}
					onEndReachedThreshold={0.5}
					onEndReached={onEndReached}
					renderItem={({ item, index }) => renderItem({ item })}
				/>
			</BottomSheet>
		</GestureHandlerRootView>
	);
};
export default ImagePickerComponent;