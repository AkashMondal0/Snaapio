import { RootState } from '@/redux-stores/store';
import { View, type ViewProps, Animated } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloAnimatedView = ({ style, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    if (!currentTheme) return <View />
    return (
        <Animated.View style={[{
            backgroundColor: currentTheme.background,
        }, style]}{...otherProps} />
    )
}

export default SkysoloAnimatedView