import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Vibration, ToastAndroid } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Icon } from '@/components/skysolo-ui';
import AppHeader from '@/components/AppHeader';
import AppPermissionDialog from '@/components/dialogs/app-permission';
import PhotosPermissionRequester from '@/components/upload/no-permission';
import ImageItem from '@/components/upload/image';
import throttle from '@/lib/throttling';
import { PageProps } from '@/types';

const NewPostSelectionScreen = memo(function NewPostSelectionScreen({ navigation }: PageProps<any>) {
    const [permission, requestPermission] = MediaLibrary.usePermissions();
    const [media, setMedia] = useState<MediaLibrary.Asset[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [selectedAssets, setSelectedAssets] = useState<MediaLibrary.Asset[]>([]);
    const selectedCount = useRef(0);

    const alertMessage = throttle(() => {
        ToastAndroid.show("You can select up to 5 images", ToastAndroid.LONG);
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
        getMediaPermission()
        const {
            assets: mediaResult,
            endCursor,
            hasNextPage,
            totalCount: totalMediaCount,
        } = await MediaLibrary.getAssetsAsync({
            mediaType: ['photo'],
            first: 20,
            sortBy: MediaLibrary.SortBy.default,
            after: totalCount.toString(),
        });

        if (totalCount < totalMediaCount) {
            setMedia([...media, ...mediaResult]);
            setTotalCount(Number(endCursor))
        }
    }, [media, totalCount]);

    const throttledFunction = throttle(() => fetchMediaPagination(), 1000);

    const removeSelectedAsset = useCallback((assets: MediaLibrary.Asset) => {
        setSelectedAssets((selectedAssets) => selectedAssets.filter(asset => asset.id !== assets.id));
        selectedCount.current -= 1;
    }, [selectedAssets]);

    const selectingAsset = useCallback((assets: MediaLibrary.Asset) => {
        if (selectedCount.current >= 5) {
            return alertMessage();
        }
        if (selectedAssets.find(asset => asset.id === assets.id)) {
            removeSelectedAsset(assets);
        } else {
            setSelectedAssets((selectedAssets) => [...selectedAssets, assets]);
            selectedCount.current += 1;
            Vibration.vibrate(10);
        }
    }, [selectedAssets]);

    const onEndReached = useCallback(() => {
        if (totalCount > 10) {
            throttledFunction();
        }
    }, [totalCount]);

    const navigateToPostReview = useCallback(() => {
        const _selectedAssets = [...selectedAssets];
        // reset all selected assets
        setSelectedAssets([]);
        selectedCount.current = 0;
        // navigate to post review screen
        navigation.navigate('upload/post/review', {
            assets: _selectedAssets,
        });
    }, [selectedAssets]);

    useEffect(() => {
        if (permission && permission.granted) {
            fetchMediaPagination();
        }
    }, [permission]);

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
                title="New Post"
                rightSideComponent={selectedCount.current > 0 ? <Icon
                    iconName='Check' isButton
                    onPress={navigateToPostReview}
                    variant="primary" /> : <View />}
                navigation={navigation} />
            <View style={{
                flex: 1
            }}>
                <FlatList
                    data={media}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    onEndReachedThreshold={0.5}
                    scrollEventThrottle={16}
                    removeClippedSubviews={true}
                    windowSize={10}
                    onEndReached={onEndReached}
                    columnWrapperStyle={{ gap: 2, paddingVertical: 1 }}
                    renderItem={({ item, index }) => {
                        return <ImageItem
                            item={item}
                            index={index}
                            selectAssetIndex={selectedAssets.findIndex(asset => asset.id === item.id)}
                            selectAsset={selectingAsset}
                            removeSelectedAsset={removeSelectedAsset}
                        />
                    }} />
            </View>
        </>
    );
}, () => true);

export default NewPostSelectionScreen