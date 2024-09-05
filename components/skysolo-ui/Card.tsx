import { RootState } from '@/redux-stores/store';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = TouchableOpacityProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloCard = ({ style, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    if (!currentTheme) return <></>
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[{
                backgroundColor: currentTheme.card,
                borderRadius: 20,
                elevation: 2,
                padding: 10,
                borderWidth: 0.8,
                borderColor: currentTheme.border,
            }, style]} {...otherProps} />
    )
}

export default SkysoloCard