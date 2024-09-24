import { RootState } from '@/redux-stores/store';
import { Text, TouchableOpacity, type TouchableOpacityProps, TextProps, ActivityIndicator } from 'react-native';
import { useSelector } from "react-redux"

export type Props = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    children?: string | React.ReactNode;
    textStyle?: TextProps["style"];
    variant?: "default" | "secondary" | "danger" | "warning" | "success" | "outline";
    size?: "small" | "medium" | "large" | "auto";
    icon?: React.ReactNode;
    loading?: boolean;
};


const SkysoloButton = ({
    children = "Button",
    style,
    textStyle,
    variant = "default",
    size = "medium",
    icon = undefined,
    loading = false,
    disabled = false,
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
                borderColor: currentTheme.secondary
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
                backgroundColor: currentTheme.primary,
                color: currentTheme.primary_foreground,
                borderColor: currentTheme.primary
            }
        }
    }

    const buttonSize = () => {
        switch (size) {
            case "small":
                return {
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                }
            case "medium":
                return {
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                    borderRadius: 12
                }
            case "large":
                return {
                    paddingVertical: 16,
                    paddingHorizontal: 32,
                    borderRadius: 12,
                }
            case "auto":
                return {}
            default:
                return {
                    paddingVertical: 6,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                }
        }
    }

    if (!currentTheme) return <></>

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            disabled={disabled}
            style={[{
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 1,
                flexDirection: 'row',
                gap: 5,
                opacity: disabled ? 0.6 : 1,
                borderWidth: disabled ? 0 : 0.6,
                borderRadius: 12,
            },
                style,
            colorVariant(),
            buttonSize() as TouchableOpacityProps["style"]
        ]}
            {...otherProps}>
            {icon ? icon : <></>}
            {typeof children === "string" ? <>
                {loading ?
                    <ActivityIndicator color={colorVariant().color} /> :
                    children ? <Text style={[{
                        color: colorVariant().color,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: 16,
                        fontWeight: "700",
                    },
                    textStyle as TextProps["style"]]}>
                        {children}
                    </Text> : <></>}
            </> : children}
        </TouchableOpacity>
    )
}

export default SkysoloButton
