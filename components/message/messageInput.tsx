import { Icon } from "@/components/skysolo-ui";
import { memo, useCallback, useContext, useRef, useState } from "react";
import { Conversation, disPatchResponse, Message } from "@/types";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import debounce from "@/lib/debouncing";
import {
    CreateMessageApi,
    fetchConversationsApi,
} from "@/redux-stores/slice/conversation/api.service";
import { Input } from "hyper-native-ui";
import { useNavigation } from "@react-navigation/native";
import { SocketContext } from "@/provider/SocketConnections";
import { configs } from "@/configs";
import { Audio } from 'expo-av';

const schema = z.object({
    message: z.string().min(1)
})
const ChatScreenInput = memo(function ChatScreenInput({
    conversation,
}: {
    conversation: Conversation | null,
}) {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { socket } = useContext(SocketContext);
    const ConversationList = useSelector((state: RootState) => state.ConversationState.conversationList, (prev, next) => prev.length === next.length)
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const [loading, setLoading] = useState(false)
    const stopTypingRef = useRef(true)
    const members = useRef(conversation?.members?.filter((i) => i !== session?.id) ?? [])
    const { control, reset, handleSubmit } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
        }
    });

    const typingSetter = useCallback(async (typing: boolean) => {
        if (!session?.id || !conversation?.id) return;
        socket?.emit(configs.eventNames.conversation.typing, {
            typing: typing,
            authorId: session?.id,
            members: members.current,
            conversationId: conversation.id,
            isGroup: conversation.isGroup ?? false
        })
    }, [conversation?.id, conversation?.isGroup, members, session?.id]);

    const onBlurTyping = debounce(() => {
        stopTypingRef.current = true
        typingSetter(false)
    }, 1600);

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
            if (!session?.id || !conversation?.id) return ToastAndroid.show("Something went wrong CI", ToastAndroid.SHORT)
            // if (isFile.length > 6) return toast.error("You can only send 6 files at a time")
            await dispatch(CreateMessageApi({
                conversationId: conversation?.id,
                authorId: session?.id,
                content: _data.message,
                fileUrl: [],
                members: members.current,
                membersPublicKey:conversation.membersPublicKey
            }) as any) as disPatchResponse<Message>
            if (ConversationList.findIndex((i) => i.id === conversation?.id) === -1) {
                dispatch(fetchConversationsApi({
                    limit: 10,
                    offset: 0,
                }) as any)
            }
            reset();
            const { sound: Start } = await Audio.Sound.createAsync(
                require('../../assets/audios/message.mp3')
            )
            await Start.playAsync();
        } catch (error: any) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        } finally {
            setLoading((pre) => !pre)
        }
    }, [conversation?.id, session?.id])

    const navigateToSelectFile = useCallback(() => {
        navigation.navigate("MessageSelectFile" as any, { conversation })
    }, [])

    return (
        <View style={{
            width: "100%",
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.6%",
            gap: 6,
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
                            maxHeight: 100
                        }}
                        containerStyle={{
                            flexShrink: 1
                        }}
                        rightSideComponent={<Icon
                            iconName="ImagePlus"
                            variant="secondary"
                            iconColorVariant="secondary"
                            size={28}
                            disabled={loading}
                            onPress={navigateToSelectFile}
                            style={{
                                padding: "4%",
                                height: 45,
                                aspectRatio: 1 / 1,
                            }} />} />
                )}
                name="message"
                rules={{ required: true }} />
            <View style={{ height: 45 }}>
                <Icon
                    iconName="Send"
                    isButton
                    size={26}
                    disabled={loading}
                    onPress={handleSubmit(sendMessageHandle)}
                    style={{
                        height: 45,
                        aspectRatio: 1 / 1,
                    }} />
            </View>
        </View>
    )
})
export default ChatScreenInput;