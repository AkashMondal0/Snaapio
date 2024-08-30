import React, { memo } from 'react';
import { FC } from 'react';
import { Button, Pressable, TouchableOpacity, View } from 'react-native';
import { CurrentTheme } from '../../types/theme';

interface FloatingButtonProps {
    theme: CurrentTheme
    icon: React.ReactNode
    onPress: () => void
}
const FloatingButton: FC<FloatingButtonProps> = ({
    theme,
    icon,
    onPress
}) => {
    return (
        <View style={{
            borderRadius: 50,
        }}>
            <Pressable
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                    backgroundColor: theme.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 5
                }}

                onPress={onPress}
                android_ripple={{
                    radius: 30,
                    color: theme.actionButtonColor,
                }}>
                {icon}
            </Pressable>
        </View>
    );
};

export default FloatingButton;