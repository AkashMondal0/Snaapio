import { memo, useCallback } from "react";
import { TouchableOpacity, Image, View, Text } from "react-native";
import * as MediaLibrary from 'expo-media-library';

const ImageItem = memo(function ImageItem({
    item,
    selectAssetIndex = -1,
    //
    onPressAssetHandle,
}: {
    item: MediaLibrary.Asset,
    selectAssetIndex: number,
    //
    onPressAssetHandle: (assets: MediaLibrary.Asset) => void,
}) {

    const pressHandler = useCallback(() => {
        onPressAssetHandle(item);
    }, [item.id]);

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
                source={{ uri: item.uri }}
                resizeMode="cover"
                style={{
                    width: '100%',
                    height: "100%",
                }} />
        </TouchableOpacity >
    )
}, (prevProps, nextProps) => {
    return prevProps.selectAssetIndex === nextProps.selectAssetIndex;
});

export default ImageItem;