/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from "@/components/skysolo-ui";

import { memo, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Conversation, disPatchResponse, Message, NavigationProps } from "@/types";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { SocketContext } from "@/provider/SocketConnections";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import debounce from "@/lib/debouncing";
import { CreateMessageApi, fetchConversationsApi } from "@/redux-stores/slice/conversation/api.service";
import { configs } from "@/configs";
import { Input } from "hyper-native-ui";
const schema = z.object({
    message: z.string().min(1)
})
const ChatScreenInput = memo(function ChatScreenInput({
    conversation,
    navigation,
}: {
    conversation: Conversation
    navigation: NavigationProps
}) {
    const dispatch = useDispatch()
    const ConversationList = useSelector((state: RootState) => state.ConversationState.conversationList, (prev, next) => prev.length === next.length)
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const [loading, setLoading] = useState(false)
    const socketState = useContext(SocketContext)
    const stopTypingRef = useRef(true)
    const members = useMemo(() => {
        return conversation.members?.filter((i) => i !== session?.id) ?? []
    }, [conversation.members, session?.id])

    const { control, reset, handleSubmit } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
        }
    });

    const typingSetter = useCallback((typing: boolean) => {
        if (session?.id && conversation.id) {
            socketState.socket?.emit(configs.eventNames.conversation.typing, {
                typing: typing,
                authorId: session?.id,
                members: members,
                conversationId: conversation.id,
                isGroup: conversation.isGroup ?? false
            })
        }
    }, [conversation.id, conversation.isGroup, members, session?.id, socketState.socket]);

    const onBlurTyping = debounce(() => {
        stopTypingRef.current = true
        typingSetter(false)
    }, 2500);

    const onTyping = useCallback(() => {
        if (stopTypingRef.current) {
            typingSetter(true)
            stopTypingRef.current = false
        }
        onBlurTyping()
    }, []);

    const sendMessageHandle = useCallback(async (_data: { message: string }) => {
        setLoading((pre) => !pre)
        try {
            if (!session?.id || !conversation.id) return ToastAndroid.show("Something went wrong CI", ToastAndroid.SHORT)
            // if (isFile.length > 6) return toast.error("You can only send 6 files at a time")
            const newMessage = await dispatch(CreateMessageApi({
                conversationId: conversation?.id,
                authorId: session?.id,
                content: _data.message,
                fileUrl: [],
                members: members,
            }) as any) as disPatchResponse<Message>
            if (newMessage?.payload?.id) {
                socketState.socket?.emit(configs.eventNames.conversation.message, {
                    ...newMessage.payload,
                    members: members
                })
            }
            if (ConversationList.findIndex((i) => i.id === conversation?.id) === -1) {
                // toast.success("New conversation created")
                dispatch(fetchConversationsApi({
                    limit: 12,
                    offset: 0,
                }) as any)
            }
            reset()
            // setIsFile([])
        } catch (error: any) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        } finally {
            setLoading((pre) => !pre)
        }
    }, [conversation.id, members, session?.id, socketState.socket])

    const navigateToSelectFile = useCallback(() => {
        navigation.navigate("message/asset/selection", { conversation })
    }, [])

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
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        keyboardType="default"
                        returnKeyType="done"
                        placeholder="Type a message"
                        multiline
                        disabled={loading}
                        onBlur={onBlur}
                        onChangeText={(text) => {
                            onChange(text)
                            onTyping()
                        }}
                        value={value}
                        onSubmitEditing={handleSubmit(sendMessageHandle)}
                        style={{
                            flex: 1,
                            height: "100%",
                            borderRadius: 20,
                            borderWidth: 0,
                            maxHeight: 100,
                        }}
                        containerStyle={{ width: "85%" }}
                        rightSideComponent={<Icon
                            iconName="ImagePlus"
                            variant="secondary"
                            iconColorVariant="secondary"
                            size={28}
                            disabled={loading}
                            onPress={navigateToSelectFile}
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
export default ChatScreenInput;