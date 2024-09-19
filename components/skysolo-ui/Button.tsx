import { RootState } from '@/redux-stores/store';
import { useCallback } from 'react';
import { Text, TouchableOpacity, type TouchableOpacityProps, TextProps, ActivityIndicator } from 'react-native';
import { useSelector } from "react-redux"

export type Props = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    children?: string;
    textStyle?: TextProps;
    variant?: "default" | "secondary" | "danger" | "warning" | "success";
    size?: "small" | "medium" | "large";
    icon?: React.ReactNode;
    loading?: boolean;
};


const SkysoloButton = ({
    onPress,
    children = "",
    style,
    textStyle,
    variant = "default",
    size = "medium",
    icon,
    loading = false,
    disabled = false,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const ThemeColor = useSelector((state: RootState) => state.ThemeState.themeColors)

    const getButtonVariant = () => {
        if (!currentTheme) return {}
        let color;
        switch (variant) {
            case "secondary":
                return {
                    backgroundColor: currentTheme.muted,
                    color: currentTheme.foreground,
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
                    color: currentTheme.primary_foreground,
                }
            case "success":
                color = ThemeColor.find((color) => color.name === "Green")
                return {
                    backgroundColor: color?.light.primary,
                    color: color?.light.primary_foreground,
                }
            default:
                return {
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.primary_foreground,
                }
        }
    }


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

    if (!currentTheme) return <></>

    return (
        <TouchableOpacity
            {...otherProps}
            activeOpacity={0.6}
            disabled={disabled}
            style={[{
                alignItems: 'center',
                justifyContent: 'center',
                elevation: variant === "secondary" ? 0 : 1,
                flexDirection: 'row',
                gap: 5,
                opacity: disabled ? 0.4 : 1,
                borderWidth: variant === "secondary" ? 1 : 0,
                borderColor: currentTheme.border,
                backgroundColor: getButtonVariant().backgroundColor,
                ...getButtonSize(),
            }, style]}
            onPress={onPress}
            {...otherProps}>
            {icon}
            {loading ?
                <ActivityIndicator color={getButtonVariant().color} /> :
                children ? <Text style={[{
                    color: getButtonVariant().color,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 16,
                    fontWeight: "700",
                },
                textStyle as TextProps["style"]]}>
                    {children}
                </Text> : <></>}
        </TouchableOpacity>
    )
}

export default SkysoloButton
