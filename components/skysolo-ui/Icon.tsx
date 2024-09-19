import { RootState } from '@/redux-stores/store';
import { TouchableOpacity, View, type TouchableOpacityProps } from 'react-native';
import { useSelector } from "react-redux"
import * as Icons from "lucide-react-native";

type IconName = keyof typeof Icons;


export type Props = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    size?: number;
    iconName: keyof typeof Icons;
    isButton?: boolean;
    disabled?: boolean;
    color?: string;
    variant?: "default" | "secondary" | "danger" | "warning" | "success";
};


const SkysoloIconButton = ({
    style,
    size = 30,
    disabled = false,
    iconName,
    isButton = false,
    variant,
    color,
    ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const ThemeColor = useSelector((state: RootState) => state.ThemeState.themeColors)
    const IconComponent = (Icons[iconName as IconName] || <></>) as React.ComponentType<any>;

    if (!currentTheme) return null

    const getButtonVariant = () => {
        let color;
        switch (variant) {
            case "secondary":
                return {
                    backgroundColor: currentTheme.secondary,
                    color: currentTheme.secondary_foreground,
                    borderColor: currentTheme.border,
                }
            case "danger":
                return {
                    backgroundColor: currentTheme.destructive,
                    color: currentTheme.destructive_foreground,
                    borderColor: currentTheme.border,
                }
            case "warning":
                color = ThemeColor.find((color) => color.name === "Yellow")
                return {
                    backgroundColor: color?.light.primary,
                    color: currentTheme.primary_foreground,
                    borderColor: color?.light.border,
                }
            case "success":
                color = ThemeColor.find((color) => color.name === "Green")
                return {
                    backgroundColor: color?.light.primary,
                    color: color?.light.primary_foreground,
                    borderColor: color?.light.border,
                }
            default:
                return {
                    backgroundColor: currentTheme.primary,
                    color: currentTheme.primary_foreground,
                    borderColor: currentTheme.border,
                }
        }
    }

    if (isButton) {
        return <TouchableOpacity
            activeOpacity={0.6}
            disabled={disabled}
            style={[{
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 4,
                width: size + 8,
                height: size + 8,
                aspectRatio: 1,
                opacity: disabled ? 0.4 : 1,
                backgroundColor: getButtonVariant().backgroundColor,
                padding: 4,
                borderRadius: 100,
                borderColor: getButtonVariant().borderColor,
            }, style]}
            {...otherProps}>
            <IconComponent size={size} color={color ?? getButtonVariant().color} key={iconName} />
        </TouchableOpacity>

    }

    return (<TouchableOpacity
        activeOpacity={0.6}
        disabled={disabled}
        {...otherProps}>
        <IconComponent size={size} color={currentTheme.foreground} key={iconName} />
    </TouchableOpacity>)
}

export default SkysoloIconButton