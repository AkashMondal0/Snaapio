import React, { useCallback } from 'react';
import { ScrollView, ToastAndroid, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import { Icon } from '@/components/skysolo-ui';
import { Text, Button, ThemedView, Input } from 'hyper-native-ui'
import { loginApi } from '@/redux-stores/slice/auth/api.service';
import { ApiResponse, Session } from '@/types';
import { setSession } from '@/redux-stores/slice/auth';

const schema = z.object({
    email: z.string().email({ message: "Invalid email" })
        .nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
        .nonempty({ message: "Password is required" })
})

const LoginScreen = ({ navigation }: any) => {
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
        },
        resolver: zodResolver(schema)
    });

    const handleLogin = useCallback(async (data: {
        email: string,
        password: string,
    }) => {
        setStats((pre) => ({ ...pre, loading: true }))
        try {
            const _data = await loginApi({
                email: data.email,
                password: data.password,
            }) as ApiResponse<Session["user"]>
            if (_data.code === 1) {
                dispatch(setSession(_data.data))
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
        <ThemedView style={{
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
                <Icon
                    disabled={state.loading}
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
                    }}>Welcome Back!</Text>
                    <Text
                        style={{
                            fontSize: 15,
                            marginBottom: 40,
                            marginHorizontal: 25,
                            textAlign: "center"
                        }}>
                        We're so excited to see you again!
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
                        {state.errorMessage}
                    </Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                disabled={state.loading}
                                style={{ width: "90%" }}
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
                                disabled={state.loading}
                                style={{ width: "82%" }}
                                secureTextEntry={!state.showPassword}
                                isErrorBorder={errors.password}
                                placeholder='Password'
                                textContentType='password'
                                returnKeyType="done"
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                rightSideComponent={<View style={{
                                    width: "8%"
                                }}>
                                    {state.showPassword ? <Icon iconName="Eye" size={26} onPress={() => setStats({ ...state, showPassword: false })} /> :
                                        <Icon iconName="EyeOff" size={26} onPress={() => setStats({ ...state, showPassword: true })} />}
                                </View>}
                            />
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

                    <Button
                        onPress={handleSubmit(handleLogin)}
                        width={"90%"}
                        style={{
                            marginVertical: 10,
                        }}
                        loading={state.loading}
                        disabled={state.loading}>
                        Login
                    </Button>
                </View>
            </ScrollView>
        </ThemedView>
    );
};



export default LoginScreen;