/* eslint-disable import/namespace */
import { RootState } from '@/redux-stores/store';
import { TouchableOpacity, View, type TouchableOpacityProps } from 'react-native';
import { useSelector } from "react-redux"
import * as Icons from "lucide-react-native";
import { useCallback, useState } from 'react';
export type IconName = keyof typeof Icons;


export type Props = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    size?: number;
    iconName: keyof typeof Icons;
    isButton?: boolean;
    disabled?: boolean;
    color?: string;
    variant?: "primary" | "secondary" | "danger" | "warning" | "success" | "outline" | "normal";
};


const SkysoloIconButton = ({
    style,
    size = 30,
    disabled = false,
    iconName = "Activity",
    isButton = false,
    variant = "primary",
    color = undefined,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const IconComponent = (Icons[iconName as IconName] || <></>) as React.ComponentType<any>;
    const [isPress, setIsPress] = useState(false)

    const colorVariant = useCallback(() => {
        if (!currentTheme) return {}
        if (disabled) {
            return {
                backgroundColor: currentTheme.muted,
                color: currentTheme.muted_foreground,
                borderColor: currentTheme.muted
            }
        }
        if (variant === "normal") {
            return {
                backgroundColor: currentTheme.background,
                color: currentTheme.foreground,
                borderColor: currentTheme.background,
            }
        }
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
    }, [currentTheme?.primary])

    if (!currentTheme) return null

    if (isButton) {
        return <View>
            <TouchableOpacity
                onPressIn={() => {
                    setIsPress(true)
                }}
                onPressOut={() => {
                    setIsPress(false)
                }}
                activeOpacity={0.6}
                disabled={disabled}
                style={[{
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 1,
                    width: size + 8,
                    height: size + 8,
                    opacity: disabled ? 0.4 : 1,
                    padding: 4,
                    borderRadius: 100,
                    borderWidth: variant === "normal" ? 0 : 0.6,
                    borderColor: isPress ? currentTheme.muted_foreground : colorVariant().borderColor,
                    backgroundColor: isPress ? currentTheme.muted : colorVariant().backgroundColor,
                }, style]}
                {...otherProps}>
                <IconComponent size={size} color={color ?? isPress ? currentTheme.muted_foreground : colorVariant().color} key={iconName} />
            </TouchableOpacity>
        </View>

    }

    return (<TouchableOpacity
        activeOpacity={0.6}
        disabled={disabled}
        {...otherProps}>
        <IconComponent size={size} color={color ?? currentTheme.foreground} key={iconName} />
    </TouchableOpacity>)
}

export default SkysoloIconButton