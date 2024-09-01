import { RootState } from '@/app/redux/store';
import { Text, type TextProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = TextProps & {
    variant?: "heading1" | "heading2" | "heading3" | "heading4";
    lightColor?: string;
    darkColor?: string;
};


const SkysoloText = ({ style, variant, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme, (prev, next) => prev?.primary === next?.primary)
    if (!currentTheme) return null
    return (
        <Text style={[{
            color: currentTheme.accent_foreground,
            fontSize: variant === "heading1" ? 32 : variant === "heading2" ? 24 : variant === "heading3" ? 18 : variant === "heading4" ? 16 : 14
        }, style]} {...otherProps} />
    )
}

export default SkysoloText