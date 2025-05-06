import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import { Icon } from '@/components/skysolo-ui';
import { Text, Button, Input } from 'hyper-native-ui'
import { loginApi } from '@/redux-stores/slice/auth/api.service';
import { StackActions, useNavigation } from '@react-navigation/native';
import { RootState } from '@/redux-stores/store';
import { clearLoginError } from '@/redux-stores/slice/auth';

const schema = z.object({
    email: z.string().email({ message: "Invalid email" })
        .nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
        .nonempty({ message: "Password is required" })
})

const LoginScreen = () => {
    const navigation = useNavigation();
    const error = useSelector((state: RootState) => state.AuthState.loginError);
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch();
    const inputRef = useRef<any>(null);
    const [loading, setLoading] = useState(false)

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
        setLoading(true)
        await dispatch(loginApi({
            email: data.email,
            password: data.password,
        }) as any)
        setLoading(false)
    }, [])

    useEffect(() => {
        dispatch(clearLoginError())
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
                    style={{
                        aspectRatio: 1,
                        width: 40,
                        marginTop: StatusBar.currentHeight
                    }}
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
                        {error}
                    </Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                disabled={loading}
                                style={{ width: "90%" }}
                                isErrorBorder={errors.email}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder='Email'
                                textContentType='emailAddress'
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() => inputRef.current?.focus()}
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
                                ref={inputRef}
                                onSubmitEditing={handleSubmit(handleLogin)}
                                blurOnSubmit={false}
                                disabled={loading}
                                style={{ width: "82%" }}
                                secureTextEntry={showPassword}
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
                                    {showPassword ? <Icon iconName="Eye" size={26} onPress={() => setShowPassword(false)} /> :
                                        <Icon iconName="EyeOff" size={26} onPress={() => setShowPassword(true)} />}
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
                        loading={loading}
                        disabled={loading}>
                        Login
                    </Button>
                    <View style={{ height: 12 }} />
                    <Button
                        width={"90%"}
                        variant="outline"
                        onPress={() => {
                            navigation.dispatch(StackActions.replace("Register"))
                        }}
                        activeOpacity={1}>
                        Register
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};



export default LoginScreen;