import React, { useEffect, useRef } from 'react';
import { FC } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CurrentTheme } from '../../types/theme';
import { Search } from 'lucide-react-native';
import { Control, Controller } from 'react-hook-form';

interface MyInputProps {
    theme: CurrentTheme,
    placeholder?: string,
    height?: number,
    width?: number,
    textSize?: number,
    icon?: React.ReactNode,
    secondaryText?: string,
    control: Control<any>,
    name: string,
    debouncedHandleSearch?: any,
    rightIcon?: React.ReactNode,
    passwordHide?: boolean,
    keyboardType?: TextInput['props']['keyboardType'],
    textContentType?: TextInput['props']['textContentType'],
    multiline?: boolean,
    returnKeyType?: TextInput['props']['returnKeyType'],
    autoFocus?: boolean,
}
const MyInput: FC<MyInputProps> = ({
    theme,
    placeholder,
    height,
    width,
    textSize,
    icon,
    secondaryText,
    control,
    name,
    debouncedHandleSearch,
    rightIcon,
    keyboardType,
    textContentType,
    passwordHide,
    multiline,
    returnKeyType,
    autoFocus
}) => {
    const textColor = theme.inputColor
    const inputRef = useRef<any>(null);

    useEffect(() => {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            inputRef.current.blur();
        });
        return () => {
            hideSubscription.remove();
        };
    }, []);



    return (
        <Controller
            control={control}
            rules={{
                required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
                <View style={{
                    backgroundColor: theme.inputBackground,
                    width: '100%',
                    flex: 1,
                    height: height || 50,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    maxHeight: height,
                    maxWidth: width,
                    paddingHorizontal: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flex: 1,
                    }}>
                        {secondaryText && <Text style={{
                            fontSize: textSize,
                            color: textColor,
                        }}>{secondaryText} </Text>}
                        {icon && <Search color={theme.iconColor} />}
                        <TextInput
                            textAlign='left'
                            autoCorrect={false}
                            ref={inputRef}
                            multiline={multiline}
                            returnKeyType={returnKeyType}
                            keyboardType={keyboardType}
                            autoFocus={autoFocus}
                            style={{
                                borderRadius: 100,
                                color: textColor,
                                fontSize: textSize,
                                flex: 1,
                                paddingVertical: 10,
                            }}
                            secureTextEntry={passwordHide}
                            textContentType={textContentType}
                            onBlur={onBlur}
                            onChangeText={(e) => {
                                onChange(e);
                                debouncedHandleSearch && debouncedHandleSearch(e)
                            }}
                            value={value}
                            placeholder={placeholder}
                            placeholderTextColor={textColor}
                        />
                    </View>
                    {rightIcon ? <>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {rightIcon}
                        </View>
                    </> : <></>}
                </View>
            )}
            name={name as any}
        />
    );
};

export default MyInput;