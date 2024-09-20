import { RootState } from '@/redux-stores/store';
import { useCallback } from 'react';
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
    const ThemeColors = useSelector((state: RootState) => state.ThemeState.themeColors)

    const color = useCallback(() => {
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
    }, [variant, currentTheme?.primary])

    const fontSize = useCallback(() => {
        if (variant === "heading1") {
            return 32
        } else if (variant === "heading2") {
            return 24
        } else if (variant === "heading3") {
            return 18
        } else if (variant === "heading4") {
            return 16
        } else {
            return 14
        }
    }, [variant, currentTheme?.primary])

    const fontWeight = useCallback(() => {
        if (variant === "heading1") {
            return "700"
        } else if (variant === "heading2") {
            return "600"
        } else if (variant === "heading3") {
            return "500"
        } else if (variant === "heading4") {
            return "400"
        } else {
            return "400"
        }
    }, [variant, currentTheme?.primary])

    if (!currentTheme) {
        return <></>
    }

    return (
        <Text
            style={[{
                color: color(),
                fontSize: fontSize(),
                fontWeight: fontWeight(),
            }, style]}
            {...otherProps} />
    )
}

export default SkysoloText