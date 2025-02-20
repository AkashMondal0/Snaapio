import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import { Icon } from '@/components/skysolo-ui';
import { Text, Button, Input } from 'hyper-native-ui'
import { registerApi } from '@/redux-stores/slice/auth/api.service';
import { ApiResponse, Session } from '@/types';
import { setSession } from '@/redux-stores/slice/auth';
import { StackActions, useNavigation } from '@react-navigation/native';
import { RootState } from '@/redux-stores/store';

const schema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).toLowerCase().regex(/^[a-z0-9]+$/, {
        message: "Username must contain only letters and numbers."
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
});


const RegisterScreen = () => {
    const navigation = useNavigation();
    const loading = useSelector((state: RootState) => state.AuthState.registerLoading);
    const error = useSelector((state: RootState) => state.AuthState.registerError);
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch();
    const input1Ref = useRef<any>(null);
    const input2Ref = useRef<any>(null);
    const input3Ref = useRef<any>(null);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
            name: '',
            username: '',
        },
        resolver: zodResolver(schema)
    });

    const handleLogin = useCallback(async (data: {
        email: string,
        password: string,
        name: string,
        username: string,
    }) => {
        dispatch(registerApi({
            email: data.email,
            password: data.password,
            name: data.name,
            username: data.username,
        }) as any)
    }, [])

    return (
        <View style={{
            flex: 1,
            height: "100%",
            width: "100%",
        }}>
            <ScrollView
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                style={{
                    flex: 1,
                    padding: 20,
                    width: "100%",
                }}>
                {navigation.canGoBack() ? <Icon
                    disabled={loading}
                    iconName="ArrowLeft"
                    size={30}
                    onPress={() => {
                        navigation.goBack()
                    }}
                    isButton /> : <></>}
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 50,
                }}>
                    <Text style={{
                        fontSize: 32,
                        fontWeight: '700',
                        textAlign: 'center',
                    }}>
                        Create an account
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            marginBottom: 40,
                            marginHorizontal: 25,
                            textAlign: "center"
                        }}>
                        Create an account to get all features
                    </Text>
                    <Text
                        variant="body1"
                        variantColor="Red"
                        style={{
                            fontSize: 18,
                            textAlign: "left",
                            fontWeight: 'bold',
                            margin: 4,
                            marginBottom: 20,
                        }}>
                        {error}
                    </Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                disabled={loading}
                                style={{
                                    width: "90%",
                                }}
                                isErrorBorder={errors.name}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder='Name'
                                textContentType="name"
                                keyboardType="default"
                                returnKeyType="next"
                                onSubmitEditing={() => input1Ref.current?.focus()}
                                blurOnSubmit={false}
                            />
                        )}
                        name="name"
                        rules={{ required: true }} />
                    <Text
                        variant="body1"
                        variantColor="Red"
                        style={{
                            fontSize: 12,
                            textAlign: "left",
                            fontWeight: 'bold',
                            margin: 4,
                            marginBottom: 20,
                        }}>
                        {errors.name?.message}
                    </Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                disabled={loading}
                                style={{
                                    width: "90%",
                                }}
                                isErrorBorder={errors.username}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder='Username'
                                keyboardType="default"
                                returnKeyType="next"
                                ref={input1Ref}
                                onSubmitEditing={() => input2Ref.current?.focus()}
                                blurOnSubmit={false} />
                        )}
                        name="username"
                        rules={{ required: true }} />
                    <Text
                        variant="body1"
                        variantColor="Red"
                        style={{
                            fontSize: 12,
                            textAlign: "left",
                            fontWeight: 'bold',
                            margin: 4,
                            marginBottom: 20,
                        }}>
                        {errors.username?.message}
                    </Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                disabled={loading}
                                style={{
                                    width: "90%",
                                }}
                                isErrorBorder={errors.email}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder='Email'
                                textContentType='emailAddress'
                                keyboardType="email-address"
                                returnKeyType="next"
                                ref={input2Ref}
                                onSubmitEditing={() => input3Ref.current?.focus()}
                                blurOnSubmit={false} />
                        )}
                        name="email"
                        rules={{ required: true }} />
                    <Text
                        variant="body1"
                        variantColor="Red"
                        style={{
                            fontSize: 12,
                            textAlign: "left",
                            fontWeight: 'bold',
                            margin: 4,
                            marginBottom: 20,
                        }}>
                        {errors.email?.message}
                    </Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                disabled={loading}
                                style={{ width: "82%" }}
                                secureTextEntry={showPassword}
                                isErrorBorder={errors.password}
                                placeholder='Password'
                                textContentType='password'
                                returnKeyType="done"
                                ref={input3Ref}
                                onSubmitEditing={handleSubmit(handleLogin)}
                                blurOnSubmit={false}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                rightSideComponent={<View style={{
                                    width: "8%"
                                }}>
                                    {showPassword ? <Icon iconName="Eye" size={26} onPress={() => setShowPassword(false)} /> :
                                        <Icon iconName="EyeOff" size={26} onPress={() => setShowPassword(true)} />}
                                </View>} />
                        )}
                        name="password"
                        rules={{ required: true }} />
                    <Text
                        variant="body1"
                        variantColor="Red"
                        style={{
                            fontSize: 12,
                            textAlign: "left",
                            fontWeight: 'bold',
                            margin: 4,
                            marginBottom: 20,
                        }}>
                        {errors.password?.message}
                    </Text>

                    <Button onPress={handleSubmit(handleLogin)} style={{
                        width: "90%",
                        marginVertical: 20,
                    }}
                        loading={loading}
                        disabled={loading}>
                        Register
                    </Button>
                </View>
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(StackActions.replace("Login"))
                }}
                    activeOpacity={1}
                    style={{
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Text
                        variantColor="secondary"
                        style={{
                            textAlign: "center",
                            paddingRight: 4,
                        }}>
                        Login
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};



export default RegisterScreen;