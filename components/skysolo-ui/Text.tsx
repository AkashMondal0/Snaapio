import { RootState } from '@/redux-stores/store';
import { Text, type TextProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = TextProps & {
    variant?: "heading1" | "heading2" | "heading3" | "heading4";
    lightColor?: string;
    darkColor?: string;
    secondaryColor?: boolean;
    colorVariant?: "default" | "danger" | "success" | "warning" | "info" | "primary" | "secondary";
    fontFamily?: "Satisfy" | "Lato" | "Montserrat" | "Nunito" | "Open Sans" | "Playpen Sans" | "Poppins" | "Roboto";
};


const SkysoloText = ({ style, variant,
    colorVariant = "default",
    fontFamily = "Roboto",
    secondaryColor, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const ThemeColors = useSelector((state: RootState) => state.ThemeState.themeColors, () => true)


    const getColorVariant = () => {
        if (colorVariant === "default") {
            return currentTheme?.foreground
        } else if (colorVariant === "danger") {
            return currentTheme?.destructive
        } else if (colorVariant === "success") {
            return ThemeColors?.find((color) => color.name === "Green")?.light.primary
        } else if (colorVariant === "warning") {
            return ThemeColors?.find((color) => color.name === "Yellow")?.light.primary
        } else if (colorVariant === "secondary") {
            return currentTheme?.muted_foreground
        }
    }

    if (!currentTheme) {
        return <></>
    }
    return (
        <Text
            style={[{
                color: getColorVariant(),
                fontSize: variant === "heading1" ? 32 : variant === "heading2" ? 24 : variant === "heading3" ? 18 : variant === "heading4" ? 16 : 14,
                fontWeight: "500"
            }, style]}
            {...otherProps} />
    )
}

export default SkysoloText