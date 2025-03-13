import React, { memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Avatar, Icon } from '@/components/skysolo-ui';
import { Button, Input, Text } from "hyper-native-ui"
import AppHeader from '@/components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { PageProps } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { profileUpdateApi } from '@/redux-stores/slice/auth/api.service';
import { useNavigation } from '@react-navigation/native';

const schema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).toLowerCase().regex(/^[a-z0-9]+$/, {
        message: "Username must contain only letters and numbers."
    }),
    email: z.string().email({
        message: "Please enter a valid email.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z.string().max(100, {
        message: "Bio must be at most 100 characters.",
    }).optional()
});
const ProfileEditScreen = memo(function ProfileEditScreen() {
    const navigation = useNavigation()
    const session = useSelector((state: RootState) => state.AuthState.session.user);
    const globalAssets = useSelector((state: RootState) => state.AccountState.globalSelectedAssets);
    const [state, setStats] = useState<{
        showPassword: boolean,
        loading: boolean,
        errorMessage: string | null
    }>({
        showPassword: false,
        loading: false,
        errorMessage: null,
    });
    const [image, setImage] = useState<string | null>(null);
    const dispatch = useDispatch();
    const pickImage = async () => {
        if (!session || state.loading) return;
        navigation.navigate("PickupImages")
    };

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            name: '',
            username: '',
            bio: '',
        },
        resolver: zodResolver(schema)
    });

    const handleUpdate = useCallback(async (inputData: {
        email: string,
        name: string,
        username: string,
        bio: string,
    }) => {
        if (!session?.id) return ToastAndroid.show("Session not found", ToastAndroid.SHORT);
        try {
            setStats((pre) => ({ ...pre, loading: true }));
            await dispatch(profileUpdateApi({
                profileId: session?.id,
                updateUsersInput: {
                    name: inputData.name,
                    username: inputData.username,
                    bio: inputData.bio,
                },
                fileUrl: globalAssets[0]
            }) as any);
            ToastAndroid.show("Profile updated", ToastAndroid.SHORT);
        }
        finally {
            setStats((pre) => ({ ...pre, loading: false }));
        }
    }, [image, session?.id]);

    useEffect(() => {
        if (globalAssets.length > 0) {
            setImage(globalAssets[0]?.uri)
        }
        if (session) {
            reset({
                email: session.email,
                name: session.name,
                username: session.username,
                bio: session.bio
            })
        }
    }, [session, globalAssets]);


    const ErrorMessage = ({ text }: any) => {
        return <Text
            variantColor="Red"
            style={{
                fontSize: 14,
                textAlign: "left",
                fontWeight: 'bold',
                marginBottom: 4,
            }}>
            {text}
        </Text>
    }

    return <View style={{
        flex: 1,
        width: "100%"
    }}>
        <AppHeader title="Edit Profile" />
        <ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'>
            <View
                style={{
                    width: 120,
                    aspectRatio: 1 / 1,
                    marginHorizontal: "auto",
                    marginTop: 20,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={pickImage}
                    style={{
                        position: "absolute",
                        zIndex: 1,
                        width: "100%",
                        height: "100%",
                        borderRadius: 500,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <Icon
                        onPress={pickImage}
                        iconName='Camera'
                        color="white"
                        size={34} />
                </TouchableOpacity>
                {image ? <Avatar
                    serverImage={false}
                    size={120}
                    url={image} /> :
                    <Avatar
                        size={120}
                        url={session?.profilePicture} />}
            </View>
            <View style={{
                padding: 20,
                paddingTop: 10,
                paddingBottom: 10,
                flexDirection: "column",
                gap: 8
            }}>
                <Text>Name</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            disabled={state.loading}
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
                    rules={{ required: false }} />
                <ErrorMessage text={errors.name?.message} />
                <Text>Email</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            disabled={state.loading}
                            isErrorBorder={errors.email}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder='Email'
                            textContentType="username"
                            keyboardType="email-address"
                            returnKeyType="next" />
                    )}
                    name="email"
                    rules={{ required: false }} />
                <ErrorMessage text={errors.email?.message} />
                <Text>Username</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            disabled={state.loading}
                            isErrorBorder={errors.email}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder="username"
                            textContentType="givenName"
                            keyboardType="default"
                            returnKeyType="next" />
                    )}
                    name="username"
                    rules={{ required: false }} />
                <ErrorMessage text={errors.username?.message} />
                <Text>Bio</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            disabled={state.loading}
                            isErrorBorder={errors.email}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            textContentType="none"
                            keyboardType="default"
                            placeholder='bio'
                            returnKeyType="done"
                            multiline
                            numberOfLines={10}
                            style={{
                                minHeight: 140,
                                textAlignVertical: 'top'
                            }}
                        />
                    )}
                    name="bio"
                    rules={{ required: false }} />
                <ErrorMessage text={errors.bio?.message} />
                <View style={{ height: 10 }} />
                <Button onPress={handleSubmit(handleUpdate)} disabled={state.loading}>
                    Submit
                </Button>
            </View>
        </ScrollView>
    </View>
}, () => true);

export default ProfileEditScreen;