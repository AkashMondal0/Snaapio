import { RootState } from "@/redux-stores/store";
import { memo, useCallback } from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "@/components/skysolo-ui";
import * as MediaLibrary from 'expo-media-library';

const ImageItem = memo(function ImageItem({
    item,
    index,
    selectedAsset,
    //
    selectAsset,
    removeSelectedAsset,
}: {
    item: MediaLibrary.Asset,
    index: number,
    selectedAsset: boolean,
    // 
    selectAsset: (assets: MediaLibrary.Asset) => void,
    removeSelectedAsset: (assets: MediaLibrary.Asset) => void,
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    const pressHandler = useCallback(() => {
        if (selectedAsset) {
            removeSelectedAsset(item);
        } else {
            selectAsset(item);
        }
    }, [item, selectedAsset]);

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
            {selectedAsset ? <TouchableOpacity
                activeOpacity={0.8}
                onPress={pressHandler}
                style={{
                    position: "absolute",
                    zIndex: 1,
                    // justifyContent: "center",
                    alignItems: "flex-end",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.3)",
                }}>
                <View style={{
                    backgroundColor: currentTheme?.primary,
                    borderRadius: 100,
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 4,
                    elevation: 2,
                }}>
                    <Icon iconName="Check" size={28}
                        color={currentTheme?.primary_foreground}
                        onPress={pressHandler} />
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
    return prevProps.selectedAsset === nextProps.selectedAsset;
});

export default ImageItem;