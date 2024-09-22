import { RootState } from '@/redux-stores/store';
import { RotateCcw } from 'lucide-react-native';
import { memo, useState } from 'react';
import { type ImageProps, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null;
    size?: number | string;
    isLocalImage?: boolean;
    isBorder?: boolean;
    showImageError?: boolean;
};


const SkysoloImage = memo(function SkysoloImage({
    style,
    url,
    isLocalImage,
    isBorder = true,
    showImageError = true,
    ...otherProps }: Props) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [error, setError] = useState(false);

    if (error && showImageError) {
        return (
            <View
                style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 20,
                    backgroundColor: currentTheme?.muted,
                    borderWidth: isBorder ? 1 : 0,
                    borderColor: currentTheme?.border,
                    justifyContent: "center",
                    alignItems: "center",
                    ...style as any,
                }}>
                <TouchableOpacity activeOpacity={0.6} style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <RotateCcw color={currentTheme?.muted_foreground} size={50} strokeWidth={0.8} />
                    <Text style={{
                        color: currentTheme?.muted_foreground,
                        fontSize: 16,
                        textAlign: "center",
                        marginVertical: 10,
                    }}>
                        Failed to load image
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <Image
            source={url ? {
                uri: url,
                cache: 'force-cache',
                width: "100%",
                height: "100%",
                borderColor: currentTheme?.border,
                borderWidth: 1,
            } : require('../../assets/images/nochat.png')}
            // onError={() => {
            //     if (error) return
            //     setError(true)
            // }}
            // onLoadEnd={() => setLoading(false)}
            style={{
                width: "100%",
                height: "auto",
                borderRadius: 20,
                resizeMode: "cover",
                ...style as any,
            }}{...otherProps} />
    )
})

export default SkysoloImage