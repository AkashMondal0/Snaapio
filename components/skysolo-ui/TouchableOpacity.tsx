import { useTheme } from 'hyper-native-ui';
import { useState } from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export type Props = TouchableOpacityProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloTouchableOpacity = ({ style, ...otherProps }: Props) => {
    const [isPress, setIsPress] = useState(false);
    const { currentTheme } = useTheme();

    if (!currentTheme) return <></>
    return (
        <TouchableOpacity
            onPressIn={() => {
                setIsPress(true)
            }}
            onPressOut={() => {
                setIsPress(false)
            }}
            delayPressIn={110}
            activeOpacity={0.8}
            style={{
                backgroundColor: isPress ? currentTheme.muted : currentTheme.background,
                ...style as any,
            }}
            {...otherProps}
        />
    )
}

export default SkysoloTouchableOpacity