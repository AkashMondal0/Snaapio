import { memo, useCallback } from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import * as MediaLibrary from 'expo-media-library';

const ImageItem = memo(function ImageItem({
    item,
    index,
    selectAssetIndex = -1,
    //
    selectAsset,
    removeSelectedAsset,
}: {
    item: MediaLibrary.Asset,
    index: number,
    selectAssetIndex: number,
    // 
    selectAsset: (assets: MediaLibrary.Asset) => void,
    removeSelectedAsset: (assets: MediaLibrary.Asset) => void,
}) {

    const pressHandler = useCallback(() => {
        if (selectAssetIndex !== -1) {
            removeSelectedAsset(item);
        } else {
            selectAsset(item);
        }
    }, [item, selectAssetIndex]);

    return (
        <TouchableOpacity
            style={{
                width: "33%",
                height: "100%",
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
            activeOpacity={0.8}
            onPress={pressHandler}
            onLongPress={pressHandler}>
            {selectAssetIndex !== -1 ? <TouchableOpacity
                activeOpacity={0.8}
                onPress={pressHandler}
                style={{
                    position: "absolute",
                    zIndex: 1,
                    alignItems: "flex-end",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.3)",
                }}>
                <View style={{
                    backgroundColor: "#259bf5",
                    borderRadius: 100,
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 4,
                    elevation: 2,
                }}>
                    <Text style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "semibold",
                    }}>{selectAssetIndex + 1}</Text>
                </View>
            </TouchableOpacity> : <></>}

            <Image
                source={{ uri: item.uri }}
                resizeMode="cover"
                style={{
                    width: '100%',
                    height: "100%",
                }} />
        </TouchableOpacity>
    )
}, (prevProps, nextProps) => {
    return prevProps.selectAssetIndex === nextProps.selectAssetIndex;
});

export default ImageItem;