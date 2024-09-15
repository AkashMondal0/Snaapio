import { memo } from 'react';
import { type ImageProps, Image } from 'react-native';

export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null;
    size?: number | string;
};


const SkysoloAvatar = memo(function SkysoloAvatar({ style, size = 40, url, ...otherProps }: Props) {
    size = Number(size)
    return (
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
    )
})

export default SkysoloAvatar