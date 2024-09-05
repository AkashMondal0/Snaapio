import { RootState } from '@/redux-stores/store';
import { View, Image, type ImageProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ImageProps & {
};

const SkysoloImage = ({ style, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    if (!currentTheme) return <View />
    return (
        <Image
            width={400}
            height={400}
            style={[{
                width: "90%",
                borderWidth: 1,
                borderColor: currentTheme.border,
            }, style]}
            resizeMode='contain'
            borderRadius={10}
            progressiveRenderingEnabled={true}
            // onLoad={() => console.log('Image loaded')}
            // onError={() => console.log('Image failed to load')}
            {...otherProps}
        />
    )
}

export default SkysoloImage