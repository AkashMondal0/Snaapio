import React, { useCallback, useContext, useEffect } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { ProfileContext } from '../../../../provider/Profile_Provider';
import { RootState } from '../../../../redux/store';
import Icon_Button from '../../../../components/shared/IconButton';
import Padding from '../../../../components/shared/Padding';
import MyInput from '../../../../components/shared/Input';
import MyButton from '../../../../components/shared/Button';
import { loginApi } from '../../../../redux/slice/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
const schema = z.object({
    email: z.string().email({ message: "Invalid email" })
        .nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
        .nonempty({ message: "Password is required" })
})

const LoginScreen = ({ navigation }: any) => {
    const profileContext = useContext(ProfileContext)
    const { error, loading, isLogin } = useSelector((state: RootState) => state.authState)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const [state, setStats] = React.useState({
        showPassword: false,
    });
    const dispatch = useDispatch()

    const { control, watch, handleSubmit, formState: { errors } } = useForm({
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
        const _data = await dispatch(loginApi({
            email: data.email,
            password: data.password,
        }) as any)
        if (_data.payload?.token) {
            profileContext.fetchUserData?.()
            navigation.navigate('home')
        }
    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 20,
            marginTop: StatusBar.currentHeight || 0,
        }}>
            <Icon_Button
                onPress={() => navigation.goBack()}
                size={30} icon={<ArrowLeft
                    size={30} color={useTheme.textColor} />}
                theme={useTheme} />

            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Text style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: useTheme.textColor,
                    textAlign: 'center',
                }}>Welcome Back!</Text>
                <Text style={{
                    fontSize: 15,
                    color: useTheme.textColor,
                    marginBottom: 40,
                    marginHorizontal: 25,
                    textAlign: "center"
                }}>
                    We're so excited to see you again!
                </Text>

                <Text style={{
                    fontSize: 15,
                    color: useTheme.DangerButtonColor,
                    textAlign: "left",
                    fontWeight: 'bold',
                    margin: 10,
                }}>
                    {error}
                </Text>
                <MyInput theme={useTheme}
                    placeholder='Email'
                    textContentType='emailAddress'
                    keyboardType="email-address"
                    returnKeyType="next"
                    height={50}
                    control={control} name='email' />
                <Text style={{
                    fontSize: 12,
                    color: useTheme.DangerButtonColor,
                    textAlign: "left",
                    fontWeight: 'bold',
                    margin: 4,
                }}>
                    {errors.email?.message}
                </Text>

                <MyInput theme={useTheme}
                    placeholder='Password'
                    textContentType='password'
                    returnKeyType="done"
                    height={50}
                    passwordHide={state.showPassword}
                    rightIcon={state.showPassword ? <TouchableOpacity onPress={() => setStats({ ...state, showPassword: false })}>
                        <Eye color={useTheme.LinkButtonColor} />
                    </TouchableOpacity> :
                        <TouchableOpacity onPress={() => setStats({ ...state, showPassword: true })}>
                            <EyeOff color={useTheme.LinkButtonColor} />
                        </TouchableOpacity>
                    }
                    control={control}
                    name='password' />
                <Text style={{
                    fontSize: 12,
                    color: useTheme.DangerButtonColor,
                    textAlign: "left",
                    fontWeight: 'bold',
                    margin: 4,
                }}>
                    {errors.password?.message}
                </Text>
                <Padding size={20} />

                <MyButton theme={useTheme}
                    onPress={handleSubmit(handleLogin)}
                    width={"100%"}
                    radius={10}
                    loading={loading}
                    disabled={loading}
                    fontWeight={'bold'}
                    title={'Log In'} />
            </View>
        </SafeAreaView>
    );
};



export default LoginScreen;