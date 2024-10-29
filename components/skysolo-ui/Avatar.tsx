import { memo, useRef, useState } from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { configs } from '@/configs';
import { RootState } from '@/redux-stores/store';
import { useSelector } from 'react-redux';
import { loadingType } from '@/types';

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
};


const SkysoloAvatar = memo(function SkysoloAvatar({ style,
    serverImage = true,
    touchableOpacity = true,
    isBorder = false,
    showImageError,
    size = 40,
    borderWidth = 2,
    url,
    TouchableOpacityOptions,
    ...otherProps }: Props) {
    size = Number(size)
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [state, setState] = useState<loadingType>("idle")
    const error = useRef(false)

    return (
        <TouchableOpacity
            {...TouchableOpacityOptions}
            style={[{
                borderWidth: isBorder ? borderWidth : 0,
                borderColor: currentTheme?.primary,
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