import React, { Suspense, useContext } from 'react';
import { FC } from 'react';
import { Animated, Image, Text } from 'react-native';
import { AnimatedContext } from '../../provider/Animated_Provider';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

interface AvatarProps {
    url?: string;
    size: number;
    style?: object;
    onPress?: () => void;
    onLongPress?: () => void;
    text?: string;
    border?: boolean
}
const Avatar: FC<AvatarProps> = ({
    url,
    size,
    style,
    onPress,
    onLongPress,
    text,
    border,
}) => {
    const AnimatedState = useContext(AnimatedContext)
    const theme = useSelector((state: RootState) => state.ThemeMode.currentTheme)

    if (!url) {
        return <Animated.View style={{
            width: size,
            height: size,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
            borderWidth: border ? 1 : 0,
            borderColor: theme?.borderColor,
            backgroundColor: AnimatedState.primaryBackgroundColor
        }}>
            <Text style={{
                fontSize: size / 2,
                color: theme?.textColor,
            }}>
                {text?.charAt(0).toUpperCase()}
            </Text>
        </Animated.View>
    }
    return (
        <Suspense fallback={<></>}>
            <Image
                source={{
                    uri: url,
                }}
                style={{
                    width: size, height: size,
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    resizeMode: 'cover',
                    ...style,
                }}
            />
        </Suspense>
    );
};

export default Avatar;