import { RootState } from '@/redux-stores/store';
import { View, type ViewProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
    value?: number;
};


const SkysoloSeparator = ({ style, value = 1, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    if (!currentTheme) return <View />

    return (
        <View style={[{
            height: value,
            width: '100%',
            backgroundColor: currentTheme.border,
        }, style]}  {...otherProps} />
    )
}

export default SkysoloSeparator