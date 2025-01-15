import { memo, useRef, useState } from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { configs } from '@/configs';
import { loadingType, variantType } from '@/types';
import { useTheme } from 'hyper-native-ui';

export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null;
    source?: null;
    size?: number | string;
    serverImage?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    showImageError?: boolean;
    TouchableOpacityOptions?: TouchableOpacityProps
    touchableOpacity?: boolean
    isBorder?: boolean
    borderWidth?: number
    borderColorVariant?: variantType
};


const SkysoloAvatar = memo(function SkysoloAvatar({ style,
    serverImage = true,
    touchableOpacity = true,
    isBorder = false,
    showImageError,
    size = 40,
    borderWidth = 2,
    borderColorVariant = "primary",
    url,
    TouchableOpacityOptions,
    ...otherProps }: Props) {
    size = Number(size)
    const { currentTheme } = useTheme();
    const [state, setState] = useState<loadingType>("idle")
    const error = useRef(false)

    const colorVariant = () => {
        if (!currentTheme) return {}
        if (borderColorVariant === "outline") {
            return {
                backgroundColor: currentTheme.secondary,
                color: currentTheme.secondary_foreground,
                borderColor: currentTheme.secondary_foreground
            }
        }
        if (borderColorVariant === "secondary") {
            return {
                backgroundColor: currentTheme.secondary,
                color: currentTheme.secondary_foreground,
                borderColor: currentTheme.border
            }
        }
        else if (borderColorVariant === "danger") {
            return {
                backgroundColor: currentTheme.destructive,
                color: currentTheme.destructive_foreground,
                borderColor: currentTheme.destructive
            }
        }
        else if (borderColorVariant === "warning") {
            return {
                backgroundColor: "hsl(47.9 95.8% 53.1%)",
                color: "hsl(26 83.3% 14.1%)",
                borderColor: "hsl(47.9 95.8% 53.1%)"
            }
        }
        else if (borderColorVariant === "success") {
            return {
                backgroundColor: "hsl(142.1 76.2% 36.3%)",
                color: "hsl(355.7 100% 97.3%)",
                borderColor: "hsl(142.1 76.2% 36.3%)"
            }
        }
        else {
            return {
                backgroundColor: currentTheme.primary,
                color: currentTheme.primary_foreground,
                borderColor: currentTheme.primary
            }
        }
    }

    return (
        <TouchableOpacity
            {...TouchableOpacityOptions}
            style={[{
                borderWidth: isBorder ? borderWidth : 0,
                borderColor: colorVariant().borderColor,
                borderRadius: 500,
                padding: 2.6,
            }, TouchableOpacityOptions?.style]}
            activeOpacity={touchableOpacity ? 0.6 : 1}
            onLongPress={otherProps.onLongPress}
            onPress={otherProps.onPress}>
            {/* <View style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: 1000,
                backgroundColor: currentTheme?.muted,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                display: state === "pending" ? "flex" : "none",
            }}>
                <Loader size={30} />
            </View> */}
            <Image
                source={!url ? require('../../assets/images/user.jpg') : serverImage ? configs.serverApi.supabaseStorageUrl + url : url}
                contentFit="cover"
                transition={100}
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
                style={[
                    {
                        resizeMode: "cover",
                        width: size,
                        height: size,
                        borderRadius: 500,
                        aspectRatio: 1,
                    }, style]}
                {...otherProps} />
        </TouchableOpacity>
    )
})

export default SkysoloAvatar