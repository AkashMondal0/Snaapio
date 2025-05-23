import { configs } from '@/configs';
import { RotateCcw } from 'lucide-react-native';
import { useRef, useMemo } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTheme } from 'hyper-native-ui';
import React from 'react';
import { ImageProps, Image } from 'expo-image';

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
    fastLoad?: boolean
};

const ImageComponent = ({
    style,
    url,
    isLocalImage,
    serverImage = true,
    isBorder = true,
    showImageError = false,
    blurUrl,
    fastLoad = false,
    ...otherProps
}: Props) => {
    const error = useRef(false);
    const { currentTheme } = useTheme();

    const imageUrl = useMemo(() => {
        if (!url) return null;
        return serverImage ? configs.serverApi.supabaseStorageUrl + url : url;
    }, [url, serverImage]);

    // Preload image for better performance
    // useEffect(() => {
    //     if (typeof imageUrl === "string") {
    //         if (!fastLoad) return
    //         Image.prefetch(imageUrl)
    //     }
    // }, [imageUrl]);

    if ((error.current && showImageError) || !url || !imageUrl) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: currentTheme?.muted, borderWidth: isBorder ? 1 : 0 }, style as any]}>
                <TouchableOpacity activeOpacity={0.6} style={styles.errorContent}>
                    <RotateCcw color={currentTheme?.foreground} size={40} strokeWidth={0.8} />
                    <Text style={[styles.errorText, { color: currentTheme?.foreground }]}>
                        Failed to load image
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, style as any]}>
            <Image
                source={{ uri: imageUrl }}
                placeholder={blurUrl}
                contentFit="cover"
                priority={"high"}
                style={[styles.image, { backgroundColor: currentTheme?.muted }, style]}
                {...otherProps}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    errorContainer: {
        width: "100%",
        height: "auto",
        justifyContent: "center",
        alignItems: "center",
    },
    errorContent: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        textAlign: "center",
    },
});

export default ImageComponent;