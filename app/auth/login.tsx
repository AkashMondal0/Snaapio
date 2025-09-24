import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ScrollView } from 'react-native-gesture-handler';
const { height: SH } = Dimensions.get("window");

const schema = z.object({
    email: z.string().email({ message: "Invalid email" })
        .nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
        .nonempty({ message: "Password is required" })
})

const LoginScreen = () => {
    const navigation = useNavigation();
    const error = useSelector((state: RootState) => state.AuthState.loginError);
    const loading = useSelector((state: RootState) => state.AuthState.loginLoading);
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch();
    const inputRef = useRef<any>(null);

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
        await dispatch(loginApi({
            email: data.email,
            password: data.password,
        }) as any);
    }, []);

    useEffect(() => {
        dispatch(clearLoginError());
    }, []);

    return (
        <KeyboardAwareScrollView
            ScrollViewComponent={ScrollView}
            keyboardShouldPersistTaps='handled'>
            <View style={{
                flex: 1,
                padding: 20,
                height: SH,
                width: "100%",
                marginTop: StatusBar.currentHeight,
                justifyContent: "space-between"
            }}>
                {/* top */}
                <View>
                    {navigation.canGoBack() ? <Icon
                        disabled={loading}
                        iconName="ArrowLeft"
                        size={30}
                        style={{
                            aspectRatio: 1,
                            width: 40,
                        }}
                        onPress={() => {
                            navigation.goBack()
                        }}
                        isButton /> : <></>}
                </View>
                {/* center */}
                <View style={{
                    // flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text style={{
                        fontSize: 32,
                        fontWeight: '700',
                        textAlign: 'center',
                    }}>Welcome Back!</Text>
                    <Text
                        style={{
                            fontSize: 15,
                            marginBottom: 12,
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
                            marginBottom: 12,
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
                            marginBottom: 12,
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
                                secureTextEntry={!showPassword}
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
                                    {!showPassword ? <Icon iconName="Eye" size={26} onPress={() => setShowPassword(true)} /> :
                                        <Icon iconName="EyeOff" size={26} onPress={() => setShowPassword(false)} />}
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
                            marginBottom: 12,
                        }}>
                        {errors.password?.message}
                    </Text>

                    <Button
                        onPress={handleSubmit(handleLogin)}
                        width={"90%"}
                        loading={loading}
                        style={{ borderRadius: 100 }}
                        disabled={loading}>
                        Login
                    </Button>
                    <View style={{ height: 12 }} />
                </View>
                {/* bottom */}
                <Button
                    center
                    disabled={loading}
                    width={"90%"}
                    variant="outline"
                    style={{ borderWidth: 2, borderRadius: 100 }}
                    onPress={() => {
                        navigation.dispatch(StackActions.replace("Register"))
                    }}
                    activeOpacity={1}>
                    Register
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
};



export default LoginScreen;