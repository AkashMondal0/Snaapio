import { memo } from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { configs } from '@/configs';

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
};


const SkysoloAvatar = memo(function SkysoloAvatar({ style,
    serverImage = true,
    touchableOpacity = true,
    showImageError, size = 40, url, TouchableOpacityOptions, ...otherProps }: Props) {
    size = Number(size)

    if (!touchableOpacity) {
        return (<Image
            source={!url ? require('../../assets/images/user.jpg') : serverImage ? configs.serverApi.supabaseStorageUrl + url : url}
            contentFit="cover"
            transition={300}
            style={[
                {
                    resizeMode: "cover",
                    width: size,
                    height: size,
                    borderRadius: 1000,
                    aspectRatio: 1,
                    justifyContent: 'center',
                }, style
            ]}
            {...otherProps} />)
    }

    return (
        <TouchableOpacity
            {...TouchableOpacityOptions}
            activeOpacity={0.6}
            onLongPress={otherProps.onLongPress}
            onPress={otherProps.onPress}>
            <Image
                source={!url ? require('../../assets/images/user.jpg') : serverImage ? configs.serverApi.supabaseStorageUrl + url : url}
                contentFit="cover"
                transition={300}
                style={[
                    {
                        resizeMode: "cover",
                        width: size,
                        height: size,
                        borderRadius: 1000,
                        aspectRatio: 1,
                    }, style
                ]}
                {...otherProps} />
        </TouchableOpacity>
    )
})

export default SkysoloAvatar