import { memo, useState } from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { Image, type ImageProps } from 'expo-image';

export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null;
    size?: number | string;
    onPress?: () => void;
    onLongPress?: () => void;
    showImageError?: boolean;
    TouchableOpacityOptions?: TouchableOpacityProps
};


const SkysoloAvatar = memo(function SkysoloAvatar({ style, showImageError, size = 40, url, TouchableOpacityOptions, ...otherProps }: Props) {
    size = Number(size)
    return (
        <TouchableOpacity
            {...TouchableOpacityOptions}
            activeOpacity={0.6}
            onLongPress={otherProps.onLongPress}
            onPress={otherProps.onPress}>
            <Image
                source={!url ? require('../../assets/images/user.jpg') : url}
                contentFit="cover"
                transition={300}
                style={[
                    {
                        resizeMode: "cover",
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        justifyContent: 'center',
                    }, style
                ]}
                {...otherProps} />
        </TouchableOpacity>
    )
})

export default SkysoloAvatar