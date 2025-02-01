import { configs } from '@/configs';
import { RotateCcw } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image, type ImageProps } from "expo-image"
import { loadingType } from '@/types';
import { Loader } from 'hyper-native-ui';
import { useTheme } from 'hyper-native-ui';
import React from 'react';


export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null | undefined;
    size?: number | string;
    isLocalImage?: boolean;
    isBorder?: boolean;
    showImageError?: boolean;
    serverImage?: boolean;
    blurUrl?: string | null | undefined;
};


const ImageComponent = ({
    style,
    url,
    isLocalImage,
    serverImage = true,
    isBorder = true,
    showImageError = false,
    blurUrl,
    ...otherProps }: Props) => {
    const error = useRef(false);
    // const [state, setState] = useState<loadingType>("idle");
    const { currentTheme } = useTheme();

    if (error.current && showImageError || !url) {
        return (
            <View
                style={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: currentTheme?.muted,
                    borderWidth: isBorder ? 1 : 0,
                    justifyContent: "center",
                    alignItems: "center",
                    ...style as any,
                }}>
                <TouchableOpacity activeOpacity={0.6}
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <RotateCcw color={currentTheme?.foreground} size={40} strokeWidth={0.8} />
                    <Text style={{
                        color: currentTheme?.foreground,
                        fontSize: 16,
                        textAlign: "center",
                    }}>
                        Failed to load image
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            {/* <View style={[{
                position: "absolute",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                display: state === "pending" ? "flex" : "none",
            }, style as any]}>
                <Loader size={40} />
            </View> */}
            <Image
                source={{ uri: serverImage ? configs.serverApi.supabaseStorageUrl + url : url }}
                contentFit="cover"
                transition={150}
                style={[{
                    width: '100%',
                    height: "100%",
                    backgroundColor: currentTheme?.background,
                }, style]}
                // onLoadStart={() => {
                //     if (state === "pending") return;
                //     setState("pending")
                // }}
                // onError={() => {
                //     error.current = true
                //     setState("normal")
                // }}
                // onLoadEnd={() => {
                //     if (state === "normal") return;
                //     setState("normal")
                // }}
                {...otherProps} />
        </>
    )
}

export default ImageComponent;