import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { disPatchResponse, Story } from '@/types';
import { Icon, Image } from '@/components/skysolo-ui';
import { Text } from 'hyper-native-ui'
import AppHeader from '@/components/AppHeader';
import { FlatList, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { resetStories } from '@/redux-stores/slice/account';
import { fetchAccountAllStroyApi } from '@/redux-stores/slice/account/api.service';
import throttle from '@/lib/throttling';
import ErrorScreen from '@/components/error/page';
import ListEmpty from '@/components/ListEmpty';
import { StackActions, useNavigation } from '@react-navigation/native';
let totalFetchedItemCount = 0
let pageLoaded = true

const HighlightSelectingScreen = memo(function HighlightSelectingScreen() {
    const stories = useSelector((state: RootState) => state.AccountState.stories);
    const loading = useSelector((state: RootState) => state.AccountState.storiesLoading);
    const error = useSelector((state: RootState) => state.AccountState.storiesError);

    const session = useSelector((state: RootState) => state.AuthState.session.user);
    const selectedAssets = useRef<Story[]>([]);
    const stopRef = useRef(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const alertMessage = throttle(() => {
        ToastAndroid.show(`You can select up to ${5} images`, ToastAndroid.LONG);
    }, 5000);

    const fetchApi = useCallback(async () => {
        if (stopRef.current || totalFetchedItemCount === -1) return
        stopRef.current = true
        try {
            const res = await dispatch(fetchAccountAllStroyApi({
                id: session?.id,
                offset: totalFetchedItemCount,
                limit: 12
            }) as any) as disPatchResponse<any[]>
            if (res.payload.length >= 12) {
                totalFetchedItemCount += res.payload.length
                return
            }
            totalFetchedItemCount = -1
        } finally { stopRef.current = false }
    }, [session?.id])

    useEffect(() => {
        if (pageLoaded) {
            fetchApi()
            pageLoaded = false
        }
    }, [session?.id])

    const onEndReached = useCallback(() => {
        if (stopRef.current || totalFetchedItemCount < 10) return
        fetchApi()
    }, [])

    const onRefresh = useCallback(() => {
        totalFetchedItemCount = 0
        dispatch(resetStories())
        fetchApi()
    }, [])

    const onPressSelectHandle = useCallback((item: Story) => {
        const index = selectedAssets.current.findIndex(asset => asset.id === item.id);
        if (selectedAssets.current.length >= 5 && index === -1) {
            return alertMessage();
        }
        if (index === -1) {
            selectedAssets.current.push(item);
            setSelectedCount((prev) => prev + 1);
        } else {
            selectedAssets.current.splice(index, 1);
            setSelectedCount((prev) => prev - 1);
        }
    }, [])

    const submitHandler = useCallback(() => {
        navigation.dispatch(
            StackActions.replace("HighlightUpload", {
                stories: selectedAssets.current
            }));
    }, [])

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader
                titleCenter
                title={selectedCount > 0 ? `Selected ${selectedCount} ` : 'Select Photos'}
                rightSideComponent={selectedCount > 0 ? <Icon
                    iconName='Check' isButton
                    onPress={submitHandler}
                    variant="primary" /> : <View />} />
            <View style={{ flex: 1 }}>
                <FlatList
                    nestedScrollEnabled
                    data={stories}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    onEndReachedThreshold={0.5}
                    scrollEventThrottle={16}
                    refreshing={false}
                    onRefresh={onRefresh}
                    onEndReached={onEndReached}
                    columnWrapperStyle={{ gap: 2, paddingVertical: 1 }}
                    renderItem={({ item, index }) => {
                        return <ImageItem item={item}
                            selectAssetIndex={selectedAssets.current.findIndex(asset => asset.id === item.id)}
                            onPressSelectHandle={onPressSelectHandle} />
                    }}
                    ListEmptyComponent={() => {
                        if (loading === "idle") return <View />
                        if (error) return <ErrorScreen message={error} />
                        if (!error && loading === "normal") return <ListEmpty text="No Stories yet" />
                    }}
                />
            </View>
        </View >
    )
})

export default HighlightSelectingScreen;

const ImageItem = memo(function ImageItem({
    item,
    onPressSelectHandle,
    selectAssetIndex = -1
}: {
    item: Story,
    selectAssetIndex?: number,
    onPressSelectHandle: (item: Story) => void
}) {

    const pressHandler = useCallback(() => {
        onPressSelectHandle(item)
    }, [item.id]);

    return (
        <TouchableOpacity
            style={{
                width: "33%",
                height: "100%",
                aspectRatio: 1 / 1.5,
                justifyContent: "center",
                alignItems: "center",
            }}
            activeOpacity={0.8}
            onPress={pressHandler}
            onLongPress={pressHandler}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={pressHandler}
                style={{
                    position: "absolute",
                    zIndex: 1,
                    alignItems: "flex-end",
                    width: "100%",
                    height: "100%",
                    backgroundColor: selectAssetIndex !== -1 ? "rgba(0,0,0,0.3)" : "transparent",
                }}>
                {selectAssetIndex !== -1 ? <View
                    style={{
                        backgroundColor: selectAssetIndex !== -1 ? "#259bf5" : "rgba(0,0,0,0.5)",
                        borderRadius: 100,
                        width: 30,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 4,
                        elevation: 2,
                        borderWidth: 0.8,
                        borderColor: "white"
                    }}>
                    <Text style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "semibold",
                    }}>
                        {selectAssetIndex + 1}
                    </Text>
                </View> : <></>}
            </TouchableOpacity>
            <Image
                url={item?.fileUrl ? item?.fileUrl[0].urls?.high : null}
                style={{
                    width: '100%',
                    height: "100%",
                }} />
        </TouchableOpacity >
    )
}, (prevProps, nextProps) => {
    // return prevProps.selectAssetIndex === nextProps.selectAssetIndex;
    return false
});