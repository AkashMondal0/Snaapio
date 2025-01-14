import { View, type ViewProps } from 'react-native';
import { useTheme } from 'hyper-native-ui'

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
    value?: number;
};


const SkysoloSeparator = ({ style, value = 1, ...otherProps }: Props) => {
    const { currentTheme } = useTheme()
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