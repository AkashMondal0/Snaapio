import { FC } from 'react';
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { CurrentTheme } from '../../types/theme';
import { Loader2 } from 'lucide-react-native';
import RotationAnimation from './Loading';

interface MyButtonProps {
    theme: CurrentTheme;
    onPress: () => void;
    title?: string;
    icon?: React.ReactNode;
    fontSize?: number;
    fontWeight?: "300" | "400" | "500" | "600" | "700" | "800" | "900" | "bold" | "normal"
    radius?: number;
    width?: number | string | any;
    height?: number | string | any;
    backgroundColor?: string;
    disabled?: boolean;
    loading?: boolean;
    padding?: number;
    elevation?: number;
    variant?: "primary" | "secondary" | "tertiary" | "warning" | "success" | "danger" | "info" | "custom";
}
const MyButton: FC<MyButtonProps> = ({
    theme,
    onPress,
    title,
    icon,
    fontSize,
    fontWeight,
    radius,
    width,
    height = 40,
    backgroundColor,
    variant,
    disabled,
    loading,
    padding,
    elevation
}) => {



    const btnColor = () => {
        switch (variant) {
            case "primary":
                return theme.ButtonColor;
            case "secondary":
                return theme.secondaryLinkButtonColor;
            case "tertiary":
                return theme.actionButtonColor;
            case "warning":
                return theme.WarningButtonColor;
            case "success":
                return theme.SuccessButtonColor;
            case "danger":
                return theme.DangerButtonColor;
            // case "info":
            //     return theme.InfoButtonColor;
            case "custom":
                return backgroundColor;
            default:
                return theme.ButtonColor;
        }
    }

    return (
        <View style={{
            borderRadius: radius,
            overflow: 'hidden',
            width: width,
            elevation: elevation,
        }}>
            <Pressable
                onPress={onPress}
                android_ripple={{
                    color: theme.selectedItemColor,
                    borderless: false,
                }}
                disabled={disabled}
                style={{
                    backgroundColor: btnColor(),
                    borderRadius: radius,
                }}>
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: padding || 10,
                    height: height,
                }}>
                    {title ? <>
                        {loading ? <RotationAnimation color={theme.color} /> : <Text style={{
                            fontSize: fontSize,
                            fontWeight: fontWeight,
                            color: theme.color
                        }}>{title}</Text>}
                    </> : <></>}
                    {icon}
                </View>
            </Pressable>
        </View>
    );
};

export default MyButton;