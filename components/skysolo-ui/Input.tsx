import { RootState } from '@/app/redux/store';
import React from 'react';
import { TextInputProps, TextInput } from 'react-native';
import { useSelector } from 'react-redux';

export type Props = TextInputProps & {
    variant?: "heading1" | "heading2" | "heading3" | "heading4";
    lightColor?: string;
    darkColor?: string;
    disabled?: boolean;
};

const SkySoloInput = ({ disabled, ...props }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [isFocused, setIsFocused] = React.useState(false)

    return (
        <TextInput
            style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                minWidth: "60%",
                borderRadius: 10,
                marginBottom: 16,
                borderColor: disabled || !isFocused ? currentTheme?.border : currentTheme?.primary,
                color: currentTheme?.foreground,
                opacity: disabled ? 0.5 : 1,
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