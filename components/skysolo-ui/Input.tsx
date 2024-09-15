import { RootState } from '@/redux-stores/store';
import React from 'react';
import { TextInputProps, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';

export type Props = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    disabled?: boolean;
    secondaryColor?: boolean;
};

const SkySoloInput = ({ disabled, secondaryColor, style, ...props }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [isFocused, setIsFocused] = React.useState(false)
    const inputRef = React.useRef<TextInput>(null)

    return (
        <TextInput
            ref={inputRef}
            style={{
                padding: 10,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: disabled || !isFocused ? currentTheme?.border : currentTheme?.primary,
                backgroundColor: secondaryColor ? currentTheme?.input : currentTheme?.foreground,
                color: currentTheme?.foreground,
                fontSize: 16,
                opacity: disabled ? 0.5 : 1,
                ...style as any
            }}
            selectionColor={currentTheme?.primary}
            placeholderTextColor={currentTheme?.muted_foreground}
            onFocus={() => { setIsFocused(true) }}
            onBlur={() => { setIsFocused(false) }}
            placeholder='Enter text here'
            blurOnSubmit={true}
            editable={disabled ? false : true}
            {...props} />
    )
}
export default SkySoloInput