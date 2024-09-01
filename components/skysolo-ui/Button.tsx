import { RootState } from '@/app/redux/store';
import { Loader2 } from 'lucide-react-native';
import { useCallback } from 'react';
import { Text, TouchableOpacity, type TouchableOpacityProps, TextProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    children?: string;
    textStyle?: TextProps;
    variant?: "default" | "secondary" | "danger" | "warning" | "success";
    size?: "small" | "medium" | "large";
    icon?: React.ReactNode;
};


const SkysoloButton = ({
    onPress,
    children = "Button",
    style,
    textStyle,
    variant = "default",
    size = "medium",
    icon,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme, (prev, next) => prev?.primary === next?.primary)
    const ThemeColor = useSelector((state: RootState) => state.ThemeState.themeColors)

    if (!currentTheme) return null

    const getButtonVariant = useCallback(() => {
        let color;
        switch (variant) {
            case "secondary":
                return {
                    backgroundColor: currentTheme.secondary,
                    color: currentTheme.secondary_foreground,
                }
            case "danger":
                return {
                    backgroundColor: currentTheme.destructive,
                    color: currentTheme.destructive_foreground,
                }
            case "warning":
                color = ThemeColor.find((color) => color.name === "Yellow")
                return {
                    backgroundColor: color?.light.primary,
                    color: currentTheme.accent,
                }
            case "success":
                color = ThemeColor.find((color) => color.name === "Green")
                return {
                    backgroundColor: color?.light.primary,
                    color: currentTheme.accent,
                }
            default:
                return {
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.accent,
                }
        }
    }, [variant, currentTheme])


    const getButtonSize = useCallback(() => {
        switch (size) {
            case "small":
                return {
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                }
            case "medium":
                return {
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 12
                }
            case "large":
                return {
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    borderRadius: 12,
                }
            default:
                return {
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                }
        }
    }, [size])

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={[{
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4,
                flexDirection: 'row',
                gap: 5,
                backgroundColor: getButtonVariant().backgroundColor,
                ...getButtonSize(),
            }, style]}
            onPress={onPress}
            {...otherProps}>
            {icon}
            <Text style={[{
                color: getButtonVariant().color,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 16,
                fontWeight: "700",
            },
            textStyle as TextProps["style"]]}>
                {children}
            </Text>
        </TouchableOpacity>
    )
}

export default SkysoloButton
