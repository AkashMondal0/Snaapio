import React, { memo, useCallback, useEffect, useState } from 'react';
import { ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Icon, Image, Input, Text, View as ThemedView } from '@/components/skysolo-ui';
import AppHeader from '@/components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { PageProps } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { profileUpdateApi } from '@/redux-stores/slice/auth/api.service';
import * as ImagePicker from 'expo-image-picker';

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
const ProfileEditScreen = memo(function ProfileEditScreen({
    navigation,
}: PageProps<any>) {
    const session = useSelector((state: RootState) => state.AuthState.session.user);
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
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.2,
            base64: true,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
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

    const handleLogin = useCallback(async (inputData: {
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
                fileUrl: image
            }) as any);
            ToastAndroid.show("Profile updated", ToastAndroid.SHORT);
        }
        finally {
            setStats((pre) => ({ ...pre, loading: false }));
        }
    }, [image, session?.id]);

    useEffect(() => {
        if (session) {
            reset({
                email: session.email,
                name: session.name,
                username: session.username,
                bio: session.bio
            })
        }
    }, [session]);


    const ErrorMessage = ({ text }: any) => {
        return <Text
            colorVariant="danger"
            style={{
                fontSize: 14,
                textAlign: "left",
                fontWeight: 'bold',
                marginBottom: 4,
            }}>
            {text}
        </Text>
    }

    return <ThemedView style={{
        flex: 1
    }}>
        <AppHeader title="Edit Profile" navigation={navigation} />
        <ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'>
            <ThemedView
                variant="secondary"
                style={{
                    width: 120,
                    aspectRatio: 1 / 1,
                    marginHorizontal: "auto",
                    marginTop: 20,
                    borderRadius: 100,
                }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={pickImage}
                    style={{
                        position: "absolute",
                        zIndex: 1,
                        width: "100%",
                        height: "100%",
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
            </ThemedView>
            <View style={{
                padding: 20,
                paddingTop: 10,
                paddingBottom: 10,
                flexDirection: "column",
                gap: 8
            }}>
                <Text variant="heading4">Name</Text>
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
                <Text variant="heading4">Email</Text>
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
                <Text variant="heading4">Username</Text>
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
                <Text variant="heading4">Bio</Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            disabled={state.loading}
                            isErrorBorder={errors.email}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            multiline
                            placeholder='bio'
                            textContentType="none"
                            keyboardType="default"
                            returnKeyType="done"
                        />
                    )}
                    name="bio"
                    rules={{ required: false }} />
                <ErrorMessage text={errors.bio?.message} />
                <View style={{ height: 10 }} />
                <Button onPress={handleSubmit(handleLogin)} disabled={state.loading}>
                    Submit
                </Button>
            </View>
        </ScrollView>
    </ThemedView>
}, () => true);

export default ProfileEditScreen;