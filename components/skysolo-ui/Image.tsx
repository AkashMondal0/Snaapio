import { RootState } from '@/redux-stores/store';
import { RotateCcw } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View, Image, type ImageProps } from 'react-native';
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


const SkysoloImage = ({
    style,
    url,
    isLocalImage,
    isBorder = true,
    showImageError = false,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [error, setError] = useState(false);

    if (error && showImageError || !url) {
        return (
            <View
                style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 20,
                    backgroundColor: currentTheme?.muted,
                    // borderWidth: isBorder ? 1 : 0,
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
                    <RotateCcw color={currentTheme?.muted_foreground} size={40} strokeWidth={0.8} />
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
            source={{ uri: url }}
            resizeMode='contain'
            borderRadius={10}
            progressiveRenderingEnabled={true}
            onError={() => {
                if (!error) setError(true)
            }}
            style={[
                {
                    width: "100%",
                    height: "auto",
                    borderRadius: 20,
                    resizeMode: "cover",
                }, style
            ]}
            {...otherProps} />
    )
}

export default SkysoloImage