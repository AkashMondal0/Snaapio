/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from "@/components/skysolo-ui";
import { memo, useCallback, useState } from "react";
import { AIApiResponse, disPatchResponse } from "@/types";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { AiMessagePromptApi } from "@/redux-stores/slice/conversation/api.service";
import { AiMessage, saveMyPrompt } from "@/redux-stores/slice/conversation";
import { uuid } from "@/lib/uuid";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native";
import { Button, Input, Text, TouchableOpacity } from "hyper-native-ui";
import React from "react";
import { getSecureStorage, setSecureStorage } from "@/lib/SecureStore";

const schema = z.object({
    message: z.string().min(1)
})
const AiChatScreenInput = memo(function AiChatScreenInput() {
    const dispatch = useDispatch()
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const messagesLoading = useSelector((Root: RootState) => Root.ConversationState?.ai_messageCreateLoading)
    const [image, setImage] = useState<string | null>(null);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const { control, reset, handleSubmit, setValue, getValues, watch } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
        }
    });

    const sendMessageHandle = useCallback(async (_data: { message: string }) => {
        try {
            if (!session?.id) return ToastAndroid.show("Something went wrong CI", ToastAndroid.SHORT);
            let allPrompts = [] as AiMessage[];
            const getPreviousPrompt = await getSecureStorage<AiMessage[]>("myPrompt", "json");
            if (getPreviousPrompt) {
                allPrompts = getPreviousPrompt
            } else {
                await setSecureStorage("myPrompt", JSON.stringify([]));
            };
            dispatch(saveMyPrompt({
                id: uuid(),
                data: {
                    content: _data.message,
                    type: "text",
                    url: null,
                },
                image: image,
                createdAt: new Date().toISOString(),
                isAi: false,
            }));
            const isGenerateImage = /generate image/i.test(_data.message);
            const response = await dispatch(AiMessagePromptApi({
                content: _data.message,
                authorId: session.id,
                file: isGenerateImage ? null : image,
                type: isGenerateImage ? "image" : "text",
            }) as any) as disPatchResponse<AIApiResponse>;
            if (response.error) {
                return ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
            };
            dispatch(saveMyPrompt({
                id: uuid(),
                data: response.payload,
                image: image,
                createdAt: new Date().toISOString(),
                isAi: true,
            }));
            reset();
        } catch (error: any) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        } finally {
            setImage(null);
        }
    }, [session?.id, image])

    const generateImage = useCallback(async () => {
        // remove image 
        setImage(null)
        if (!session?.id) return ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        setValue("message", `${getValues("message")} Generate Image`, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
        // check if user is logged in
    }, []);

    return (
        <>
            <View style={{
                width: "100%",
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 10,
                gap: 6,
            }}>
                {/* generate image trigger component */}
                {image ? <View
                    style={{
                        borderRadius: 20
                    }}>
                    <TouchableOpacity onPress={() => { setImage(null) }} style={{
                        padding: 0,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        flex: 1,
                        height: "100%",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        aspectRatio: 1 / 1,
                        borderRadius: 10,
                        backgroundColor: "rgba(0,0,0,0.2)",
                    }}>
                        <Icon
                            iconName="Trash2"
                            iconColorVariant={"secondary"}
                            size={26}
                            strokeWidth={1.5}
                            disabled={messagesLoading} onPress={() => { setImage(null) }} />
                    </TouchableOpacity>
                    <Image source={{ uri: image }} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10
                    }} />
                </View> :
                    <Button
                        disabled={messagesLoading}
                        onPress={generateImage}
                        activeOpacity={0.5}
                        variant="outline"
                        style={{
                            borderRadius: 20,
                            paddingHorizontal: 10,
                            borderWidth: 0.6,
                            gap: 4,
                            padding: 4,
                            display: watch("message").includes("Generate Image") ? "none" : "flex"
                        }}>
                        <Icon
                            iconName="Image"
                            iconColorVariant="success"
                            size={26}
                            style={{ padding: 0 }}
                            strokeWidth={1.5}
                            disabled={messagesLoading}
                            onPress={generateImage} />
                        <Text variant="body2">Generate Image</Text>
                    </Button>}
            </View>
            <View style={{
                width: "100%",
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.6%",
                gap: 6
            }}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            keyboardType="default"
                            returnKeyType="done"
                            placeholder="Type a message"
                            // variant="secondary"
                            multiline
                            disabled={messagesLoading}
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
                            containerStyle={{ flexShrink: 1 }}
                            rightSideComponent={<Icon
                                iconName="ImagePlus"
                                variant="secondary"
                                iconColorVariant="secondary"
                                size={28}
                                disabled={messagesLoading || /generate image/i.test(watch("message"))}
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
                    disabled={messagesLoading}
                    onPress={handleSubmit(sendMessageHandle)}
                    style={{
                        width: "10%",
                        height: 45,
                        aspectRatio: 1 / 1,
                    }} />
            </View>
        </>
    )
})
export default AiChatScreenInput;