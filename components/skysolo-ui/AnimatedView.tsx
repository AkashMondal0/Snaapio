import { View, type ViewProps, Animated } from 'react-native';
import { useTheme } from 'hyper-native-ui';    

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloAnimatedView = ({ style, ...otherProps }: Props) => {
    const { currentTheme } = useTheme();
    if (!currentTheme) return <View />
    return (
        <Animated.View style={[{
            backgroundColor: currentTheme.background,
        }, style]}{...otherProps} />
    )
}

export default SkysoloAnimatedView