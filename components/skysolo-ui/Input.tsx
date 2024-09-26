import { RootState } from '@/redux-stores/store';
import React from 'react';
import { TextInputProps, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';

export type Props = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    disabled?: boolean;
    secondaryColor?: boolean;
    rightSideComponent?: React.ReactNode;
    leftSideComponent?: React.ReactNode;
    onFocus?: () => void;
    onBlur?: () => void;
    isErrorBorder?: boolean | unknown
};

const SkySoloInput = ({ disabled,
    onBlur,
    onFocus,
    isErrorBorder,
    secondaryColor,
    style, ...props }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [isFocused, setIsFocused] = React.useState(false)

    return (
        <View
            style={[{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 14,
                borderWidth: 1,
                padding: 8,
                height: 50,
                opacity: disabled ? 0.5 : 1,
                borderColor: isErrorBorder ? currentTheme?.destructive : disabled || !isFocused ? currentTheme?.border : currentTheme?.primary,
                backgroundColor: secondaryColor ? currentTheme?.accent : currentTheme?.background,
            }, style]}>
            {props.leftSideComponent}
            <TextInput
                style={{
                    color: currentTheme?.accent_foreground,
                    height: 50,
                    width: '100%',
                    ...style as any
                }}
                selectionHandleColor={currentTheme?.primary}
                placeholderTextColor={currentTheme?.muted_foreground}
                onFocus={() => {
                    onFocus && onFocus()
                    setIsFocused(true)
                }}
                onBlur={() => {
                    onBlur && onBlur()
                    setIsFocused(false)
                }}
                placeholder='Enter text here'
                blurOnSubmit={true}
                editable={disabled ? false : true}
                {...props} />
            {props.rightSideComponent}
        </View>
    )
}
export default SkySoloInput