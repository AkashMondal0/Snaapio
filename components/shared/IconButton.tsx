import React from 'react';
import { FC } from 'react';
import { Image, Pressable, View } from 'react-native';
import { CurrentTheme } from '../../types/theme';

interface Icon_ButtonProps {
    size: number;
    onPress?: () => void;
    onLongPress?: () => void;
    icon: React.ReactNode;
    theme: CurrentTheme;
    backgroundColor?: string;
    backgroundEnable?: boolean;
    disabled?: boolean;
}
const Icon_Button: FC<Icon_ButtonProps> = ({
    size,
    onPress,
    onLongPress,
    icon,
    theme,
    backgroundColor = theme.cardBackground,
    backgroundEnable = true,
    disabled = false,
}) => {
    return (
        <View style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            backgroundColor: backgroundEnable ? backgroundColor : 'transparent',
            overflow: 'hidden',
            padding: 10,
        }}>
            <Pressable style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            padding: 10,
        }}

            android_ripple={{
                color: theme.iconActiveColor,
                borderless: true,
                radius: size,
            }}
            onPress={onPress}
            disabled={disabled}
            onLongPress={onLongPress}>
            {icon}
        </Pressable>
        </View>
    );
};

export default Icon_Button;