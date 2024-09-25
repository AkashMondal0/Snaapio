import React, { useCallback } from 'react';
import { ScrollView, ToastAndroid, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import { Button, Icon, Input, Text } from '@/components/skysolo-ui';
import { registerApi } from '@/redux-stores/slice/auth/api.service';
import { ApiResponse, Session } from '@/types';
import { setSession } from '@/redux-stores/slice/auth';
import { SecureStorage } from '@/lib/SecureStore';
import { configs } from '@/configs';

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


const RegisterScreen = ({ navigation }: any) => {
    const [state, setStats] = React.useState<{
        showPassword: boolean,
        loading: boolean,
        errorMessage: string | null
    }>({
        showPassword: false,
        loading: false,
        errorMessage: null
    });
    const dispatch = useDispatch()

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
        setStats((pre) => ({ ...pre, loading: true }))
        try {
            const _data = await registerApi({
                email: data.email,
                password: data.password,
                name: data.name,
                username: data.username,
            }) as ApiResponse<Session["user"]>
            if (_data.code === 1) {
                const session = _data.data
                dispatch(setSession(session))
                SecureStorage("set", configs.sessionName, JSON.stringify(_data.data))
                return
            }
            setStats((pre) => ({ ...pre, errorMessage: _data.message }))
            ToastAndroid.show(_data.message, ToastAndroid.SHORT)
            return
        } finally {
            setStats((pre) => ({ ...pre, loading: false }))
        }
    }, [])

    return (
        <ScrollView style={{
            flex: 1,
            padding: 20,
            width: "100%",
        }}>
            <Icon
                iconName="ArrowLeft"
                size={30}
                onPress={() => navigation.goBack()}
                isButton />
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
                    colorVariant="danger"
                    style={{
                        fontSize: 18,
                        textAlign: "left",
                        fontWeight: 'bold',
                        margin: 4,
                        marginBottom: 20,
                    }}>
                    {state.errorMessage}
                </Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            disabled={state.loading}
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
                            returnKeyType="next" />
                    )}
                    name="name"
                    rules={{ required: true }} />
                <Text
                    colorVariant="danger"
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
                            disabled={state.loading}
                            style={{
                                width: "90%",
                            }}
                            isErrorBorder={errors.username}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder='Username'
                            textContentType='username'
                            keyboardType="default"
                            returnKeyType="next" />
                    )}
                    name="username"
                    rules={{ required: true }} />
                <Text
                    colorVariant="danger"
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
                            disabled={state.loading}
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
                            returnKeyType="next" />
                    )}
                    name="email"
                    rules={{ required: true }} />
                <Text
                    colorVariant="danger"
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
                            disabled={state.loading}
                            style={{ width: "90%" }}
                            secureTextEntry={!state.showPassword}
                            isErrorBorder={errors.password}
                            placeholder='Password'
                            textContentType='password'
                            returnKeyType="done"
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            rightSideComponent={state.showPassword ? <Icon iconName="Eye" size={26} onPress={() => setStats({ ...state, showPassword: false })} /> :
                                <Icon iconName="EyeOff" size={26} onPress={() => setStats({ ...state, showPassword: true })} />} />
                    )}
                    name="password"
                    rules={{ required: true }} />
                <Text
                    colorVariant="danger"
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
                    loading={state.loading}
                    disabled={state.loading}>
                    Register
                </Button>
            </View>
        </ScrollView>
    );
};



export default RegisterScreen;