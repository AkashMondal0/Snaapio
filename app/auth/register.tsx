import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar, View, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import { Icon } from '@/components/skysolo-ui';
import { Text, Button, Input } from 'hyper-native-ui'
import { registerApi } from '@/redux-stores/slice/auth/api.service';
import { clearLoginError } from '@/redux-stores/slice/auth';
import { StackActions, useNavigation } from '@react-navigation/native';
import { RootState } from '@/redux-stores/store';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
const { height: SH } = Dimensions.get("window");

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
    const error = useSelector((state: RootState) => state.AuthState.registerError);
    const loading = useSelector((state: RootState) => state.AuthState.registerLoading);
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
        await dispatch(registerApi({
            email: data.email,
            password: data.password,
            name: data.name,
            username: data.username,
        }) as any);
    }, []);

    useEffect(() => {
        dispatch(clearLoginError());
    }, []);

    return (
        <KeyboardAwareScrollView
            ScrollViewComponent={ScrollView}
            keyboardShouldPersistTaps='handled'>
            <View
                style={{
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
                    justifyContent: "center",
                    alignItems: "center",
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
                            marginBottom: 12,
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
                            marginBottom: 12,
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
                            marginBottom: 12,
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
                            marginBottom: 12,
                        }}>
                        {errors.email?.message}
                    </Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                disabled={loading}
                                style={{ width: "82%" }}
                                secureTextEntry={!showPassword}
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
                                    {!showPassword ? <Icon iconName="Eye" size={26} onPress={() => setShowPassword(true)} /> :
                                        <Icon iconName="EyeOff" size={26} onPress={() => setShowPassword(false)} />}
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
                            marginBottom: 12,
                        }}>
                        {errors.password?.message}
                    </Text>

                    <Button onPress={handleSubmit(handleLogin)}
                        width={"90%"}
                        style={{ borderRadius: 100 }}
                        loading={loading}
                        disabled={loading}>
                        Register
                    </Button>
                </View>
                {/* bottom */}
                <Button
                    center
                    disabled={loading}
                    onPress={() => {
                        navigation.dispatch(StackActions.replace("Login"))
                    }}
                    style={{ borderWidth: 2, borderRadius: 100 }}
                    activeOpacity={1}
                    width={"90%"}
                    variant="outline">
                    Login
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
};



export default RegisterScreen;