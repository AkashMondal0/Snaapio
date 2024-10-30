import { RootState } from '@/redux-stores/store';
import { View, type ViewProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ViewProps & {
    variant?: "default" | "secondary" | "danger" | "warning" | "success" | "outline";
    lightColor?: string;
    darkColor?: string;
};


const SkysoloView = ({
    variant = "default",
    style,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    const colorVariant = () => {
        if (!currentTheme) return {}
        if (variant === "outline") {
            return {
                backgroundColor: currentTheme.secondary,
                color: currentTheme.secondary_foreground,
                borderColor: currentTheme.secondary_foreground
            }
        }
        if (variant === "secondary") {
            return {
                backgroundColor: currentTheme.secondary,
                color: currentTheme.secondary_foreground,
                borderColor: currentTheme.border
            }
        }
        else if (variant === "danger") {
            return {
                backgroundColor: currentTheme.destructive,
                color: currentTheme.destructive_foreground,
                borderColor: currentTheme.destructive
            }
        }
        else if (variant === "warning") {
            return {
                backgroundColor: "hsl(47.9 95.8% 53.1%)",
                color: "hsl(26 83.3% 14.1%)",
                borderColor: "hsl(47.9 95.8% 53.1%)"
            }
        }
        else if (variant === "success") {
            return {
                backgroundColor: "hsl(142.1 76.2% 36.3%)",
                color: "hsl(355.7 100% 97.3%)",
                borderColor: "hsl(142.1 76.2% 36.3%)"
            }
        }
        else {
            return {
                backgroundColor: currentTheme.background,
                color: currentTheme.primary_foreground,
                borderColor: currentTheme.border
            }
        }
    }

    if (!currentTheme) return <View />
    return (
        <View style={[{
            backgroundColor: colorVariant().backgroundColor,
            borderColor: currentTheme.border,
        }, style]} {...otherProps} />
    )
}

export default SkysoloView


export const ThemedView = ({
    style,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    if (!currentTheme) return <View />
    return (
        <View style={[{
            backgroundColor: currentTheme.background,
            borderColor: currentTheme.border,
        }, style]} {...otherProps} />
    )
}
