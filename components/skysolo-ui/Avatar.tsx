import React, { memo, useMemo, useEffect } from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { configs } from '@/configs';
import { variantType } from '@/types';
import { useTheme } from 'hyper-native-ui';

export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null;
    size?: number | string;
    serverImage?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    showImageError?: boolean;
    TouchableOpacityOptions?: TouchableOpacityProps;
    touchableOpacity?: boolean;
    isBorder?: boolean;
    borderWidth?: number;
    borderColorVariant?: variantType;
    fastLoad?: boolean
};

const Avatar = memo(function Avatar({
    style,
    serverImage = true,
    touchableOpacity = true,
    isBorder = false,
    showImageError,
    size = 40,
    borderWidth = 1.6,
    borderColorVariant = "primary",
    url,
    fastLoad = false,
    TouchableOpacityOptions,
    ...otherProps
}: Props) {
    const { currentTheme } = useTheme();
    const imageSize = Number(size);

    const imageUrl = useMemo(() => {
        if (!url) return require('../../assets/images/user.jpg');
        return serverImage ? configs.serverApi.supabaseStorageUrl + url : url;
    }, [url, serverImage]);

    useEffect(() => {
        if (typeof imageUrl === "string") {
            if (!fastLoad) return
            Image.prefetch(imageUrl)
        }
    }, [imageUrl]);

    const colorVariant = useMemo(() => {
        if (!currentTheme) return {};
        switch (borderColorVariant) {
            case "outline":
                return {
                    borderColor: currentTheme.secondary_foreground,
                };
            case "secondary":
                return {
                    borderColor: currentTheme.border,
                };
            case "danger":
                return {
                    borderColor: currentTheme.destructive,
                };
            case "warning":
                return {
                    borderColor: "hsl(47.9 95.8% 53.1%)",
                };
            case "success":
                return {
                    borderColor: "hsl(142.1 76.2% 36.3%)",
                };
            default:
                return {
                    borderColor: currentTheme.primary,
                };
        }
    }, [borderColorVariant, currentTheme]);

    return (
        <TouchableOpacity
            {...TouchableOpacityOptions}
            style={[
                {
                    borderRadius: 500,
                    padding: 0.5,
                    borderWidth: isBorder ? borderWidth : 0,
                    borderColor: isBorder ? colorVariant.borderColor : "transparent",
                },
                TouchableOpacityOptions?.style,
            ]}
            activeOpacity={touchableOpacity ? 0.6 : 1}
            onLongPress={otherProps.onLongPress}
            onPress={otherProps.onPress}
        >
            <Image
                source={imageUrl}
                contentFit="cover"
                contentPosition={"top center"}
                priority={"high"}
                style={[
                    {
                        resizeMode: "cover",
                        borderRadius: 500,
                        aspectRatio: 1,
                        width: imageSize,
                        height: imageSize,
                        backgroundColor: currentTheme?.muted,
                    },
                    style,
                ]}
                {...otherProps}
            />
        </TouchableOpacity>
    );
});

export default Avatar;