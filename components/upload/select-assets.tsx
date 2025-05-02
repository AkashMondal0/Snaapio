import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, ToastAndroid, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Icon } from '@/components/skysolo-ui';
import AppHeader from '@/components/AppHeader';
import AppPermissionDialog from '@/components/dialogs/app-permission';
import PhotosPermissionRequester from '@/components/upload/no-permission';
import ImageItem from '@/components/upload/image';
import throttle from '@/lib/throttling';
import { PageProps } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { setDeviceAssets } from '@/redux-stores/slice/account';

let loaded = false;
const SelectAssets = memo(function SelectAssets({
    nextAction,
    assetsLimit = 5,
    mediaType = ['photo']
}: PageProps<any> & {
    assetsLimit?: number;
    mediaType?: any[]
    nextAction: (selectedAssets: MediaLibrary.Asset[]) => void;
}) {
    const [permission, requestPermission] = MediaLibrary.usePermissions();
    const media = useSelector((state: RootState) => state.AccountState.deviceAssets);
    const selectedAssets = useRef<MediaLibrary.Asset[]>([]);
    const totalCount = useRef(media.length);
    const [selectedCount, setSelectedCount] = useState(0);
    const dispatch = useDispatch();

    const alertMessage = throttle(() => {
        ToastAndroid.show(`You can select up to ${assetsLimit} images`, ToastAndroid.LONG);
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
            mediaType: mediaType,
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

    const navigateToPostReview = useCallback(() => {
        const _selectedAssets = [...selectedAssets.current];
        // reset all selected assets
        setSelectedCount(0)
        selectedAssets.current = [];
        nextAction(_selectedAssets);
    }, [selectedAssets]);

    useEffect(() => {
        if (!loaded && permission?.granted && media.length >= 0) {
            getMediaPermission();
            fetchMediaPagination();
        }
    }, [permission?.granted]);

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

    return (
        <>
            <AppHeader
                titleCenter
                title={selectedCount > 0 ? `Selected ${selectedCount} ` : 'Select Items'}
                rightSideComponent={selectedCount > 0 ? <Icon
                    iconName='Check' isButton
                    style={{ width: 36 }}
                    onPress={navigateToPostReview}
                    variant="primary" /> : <></>} />
            <View style={{ flex: 1 }}>
                <FlatList
                    nestedScrollEnabled
                    data={media}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    onEndReachedThreshold={0.5}
                    scrollEventThrottle={16}
                    onEndReached={onEndReached}
                    columnWrapperStyle={{ gap: 2, paddingVertical: 1 }}
                    renderItem={({ item, index }) => {
                        return <ImageItem
                            item={item}
                            selectAssetIndex={selectedAssets.current.findIndex(asset => asset.id === item.id)}
                            onPressAssetHandle={onPressAssetHandle} />
                    }} />
            </View>
        </>
    );
});

export default SelectAssets;