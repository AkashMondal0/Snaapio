/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, Input } from "@/components/skysolo-ui";
import { memo, useCallback, useState } from "react";
import { disPatchResponse, NavigationProps } from "@/types";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { AiMessagePromptApi } from "@/redux-stores/slice/conversation/api.service";
import { AiMessage, saveMyPrompt } from "@/redux-stores/slice/conversation";
import { uuid } from "@/lib/uuid";
import { localStorage } from "@/lib/LocalStorage";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native";

const schema = z.object({
    message: z.string().min(1)
})
const AiChatScreenInput = memo(function AiChatScreenInput({
    navigation,
}: {
    navigation: NavigationProps
}) {
    const dispatch = useDispatch()
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const { control, reset, handleSubmit } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
        }
    });

    const sendMessageHandle = useCallback(async (_data: { message: string }) => {
        setLoading((pre) => !pre)
        try {
            if (!session?.id) return ToastAndroid.show("Something went wrong CI", ToastAndroid.SHORT)
            let allPrompts = [] as AiMessage[];
            const getPreviousPrompt = await localStorage("get", "myPrompt")
            if (getPreviousPrompt) {
                allPrompts = JSON.parse(getPreviousPrompt) as AiMessage[]
            } else {
                await localStorage("set", "myPrompt", JSON.stringify([]))
            }
            dispatch(saveMyPrompt({
                id: uuid(),
                content: _data.message,
                image: image,
                createdAt: new Date().toISOString(),
                isAi: false,
            }))
            const response = await dispatch(AiMessagePromptApi({
                content: _data.message,
                authorId: session.id,
                file: image
            }) as any) as disPatchResponse<string | any>
            if (response.error) {
                return ToastAndroid.show(response.payload?.message || "Something went wrong", ToastAndroid.SHORT)
            }
            dispatch(saveMyPrompt({
                id: uuid(),
                content: response.payload,
                image: image,
                createdAt: new Date().toISOString(),
                isAi: true,
            }))
            await localStorage("set", "myPrompt", JSON.stringify([...allPrompts,
            {
                id: uuid(),
                content: _data.message,
                image: image,
                createdAt: new Date().toISOString(),
                isAi: false,
            }, {
                id: uuid(),
                image: image,
                content: response.payload,
                createdAt: new Date().toISOString(),
                isAi: true,
            }]))
            reset()
            setImage(null)
        } catch (error: any) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        } finally {
            setLoading((pre) => !pre)
        }
    }, [session?.id, image])

    // const navigateToSelectFile = useCallback(() => {
    //     ToastAndroid.show("Coming soon...", ToastAndroid.SHORT)
    //     // navigation.navigate("message/asset/selection", {  })
    // }, [])

    return (
        <View style={{
            width: "100%",
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.6%",
            gap: 6
        }}>
            {image ? <Image source={{ uri: image }} style={{
                width: 50,
                height: 50,
                borderRadius: 10
            }} /> : <></>}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        keyboardType="default"
                        returnKeyType="done"
                        placeholder="Type a message"
                        secondaryColor
                        multiline
                        disabled={loading}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={handleSubmit(sendMessageHandle)}
                        style={{
                            flex: 1,
                            height: "100%",
                            borderRadius: 20,
                            borderWidth: 0,
                            maxHeight: 100,
                        }}
                        rightSideComponent={<Icon
                            iconName="ImagePlus"
                            variant="secondary"
                            iconColorVariant="secondary"
                            size={28}
                            disabled={loading}
                            onPress={pickImage}
                            style={{
                                width: "10%",
                                height: 45,
                                marginHorizontal: 5,
                                aspectRatio: 1 / 1,
                            }} />} />
                )}
                name="message"
                rules={{ required: true }} />
            <Icon
                iconName="Send"
                isButton
                size={26}
                disabled={loading}
                onPress={handleSubmit(sendMessageHandle)}
                style={{
                    width: "10%",
                    height: 45,
                    aspectRatio: 1 / 1,
                }} />
        </View>
    )
})
export default AiChatScreenInput;