import { memo } from 'react';
import {type ImageProps, Image } from 'react-native';
export type Props = ImageProps & {
    lightColor?: string;
    darkColor?: string;
    url?: string | null;
    size?: number | string;
};


const SkysoloImage = memo(function SkysoloImage({ style, url, ...otherProps }: Props) {
    return (
        <Image
            source={url ? { uri: url } : require('../../assets/images/user.jpg')}
            style={{
                width: "100%",
                height:"auto",
                borderRadius: 20,
                resizeMode: "cover",
                ...style as any,
            }}{...otherProps} />
    )
})

export default SkysoloImage