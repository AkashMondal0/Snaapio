import { memo } from 'react';
import { type ImageProps, TouchableOpacityProps, Image, TouchableOpacity } from 'react-native';

export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null;
    size?: number | string;
    onPress?: () => void;
    onLongPress?: () => void;
    TouchableOpacityOptions?: TouchableOpacityProps
};


const SkysoloAvatar = memo(function SkysoloAvatar({ style, size = 40, url, TouchableOpacityOptions, ...otherProps }: Props) {
    size = Number(size)
    return (
        <TouchableOpacity
            {...TouchableOpacityOptions}
            activeOpacity={0.6}
            onLongPress={otherProps.onLongPress}
            onPress={otherProps.onPress}>
            <Image
                source={url ? { uri: url } : require('../../assets/images/user.jpg')}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    resizeMode: 'cover',
                    ...style as any,
                }}{...otherProps} />
        </TouchableOpacity>
    )
})

export default SkysoloAvatar