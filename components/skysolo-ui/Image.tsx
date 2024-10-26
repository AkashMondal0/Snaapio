import { configs } from '@/configs';
import { RootState } from '@/redux-stores/store';
import { RotateCcw } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Image, type ImageProps } from "expo-image"
import { loadingType } from '@/types';
import Loader from './Loader';


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


const SkysoloImage = ({
    style,
    url,
    isLocalImage,
    serverImage = true,
    isBorder = true,
    showImageError = false,
    blurUrl,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const error = useRef(false)
    const [state, setState] = useState<loadingType>("idle")

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
            <View style={[{
                position: "absolute",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                display: state === "pending" ? "flex" : "none",
            }, style]}>
                <Loader size={40} />
            </View>
            <Image
                source={{ uri: serverImage ? configs.serverApi.supabaseStorageUrl + url : url }}
                contentFit="cover"
                transition={150}
                style={[{
                    width: '100%',
                    height: "100%",
                    backgroundColor: currentTheme?.background,
                }, style]}
                onLoadStart={() => {
                    if (state === "pending") return;
                    setState("pending");
                }}
                onError={() => {
                    error.current = true;
                }}
                onLoadEnd={() => {
                    if (state === "normal") return;
                    setState("normal");
                }}
                {...otherProps} />
        </>
    )
}

export default SkysoloImage