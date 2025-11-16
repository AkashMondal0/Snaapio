import { Icon } from "@/components/skysolo-ui";
import { memo, useCallback, useContext, useRef, useState, useEffect } from "react";
import { Conversation, disPatchResponse, Message } from "@/types";
import { ToastAndroid, View } from "react-native";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
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
import { Audio } from "expo-av";

const MESSAGE_SCHEMA = z.object({
  message: z.string().min(1),
});

const TYPING_DEBOUNCE_MS = 1600;

const ChatScreenInput = memo(function ChatScreenInput({
  conversation,
}: {
  conversation: Conversation | null;
}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { sendDataToServer } = useContext(SocketContext);

  const ConversationList = useSelector(
    (state: RootState) => state.ConversationState.conversationList,
    shallowEqual
  );

  const session = useSelector(
    (state: RootState) => state.AuthState.session.user,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const stopTypingRef = useRef(true);
  const members = useRef(
    conversation?.members?.filter((i) => i !== session?.id) ?? []
  );

  const { control, reset, handleSubmit } = useForm({
    resolver: zodResolver(MESSAGE_SCHEMA),
    defaultValues: { message: "" },
  });

  /** Emit typing event */
  const typingSetter = useCallback(
    (typing: boolean) => {
      if (!session?.id || !conversation?.id) return;
      sendDataToServer(configs.eventNames.conversation.typing, {
        typing,
        authorId: session.id,
        members: members.current,
        conversationId: conversation.id,
        isGroup: conversation.isGroup ?? false,
      });
    },
    [session?.id, conversation?.id, conversation?.isGroup, sendDataToServer]
  );

  /** Debounced stop typing */
  const onBlurTyping = useCallback(
    debounce(() => {
      stopTypingRef.current = true;
      typingSetter(false);
    }, TYPING_DEBOUNCE_MS),
    [typingSetter]
  );

  /** Typing handler */
  const onTyping = useCallback(() => {
    if (stopTypingRef.current) {
      typingSetter(true);
      stopTypingRef.current = false;
    }
    onBlurTyping();
  }, [typingSetter, onBlurTyping]);

  /** Send message handler */
  const sendMessageHandle = useCallback(
    async (_data: { message: string }) => {
      if (!session?.id || !conversation?.id) {
        // ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        return;
      }

      setLoading(true);
      try {
        await dispatch(
          CreateMessageApi({
            conversationId: conversation.id,
            authorId: session.id,
            content: _data.message,
            fileUrl: [],
            members: members.current.filter((i) => i !== session.id),
            membersPublicKey: conversation.membersPublicKey,
          }) as any
        );

        // If conversation not in list, fetch it
        if (ConversationList.findIndex((i) => i.id === conversation.id) === -1) {
          await dispatch(
            fetchConversationsApi({ limit: 10, offset: 0 }) as any
          );
        }

        reset();

        // Play send sound
        const { sound: startSound } = await Audio.Sound.createAsync(
          require("../../assets/audios/message.mp3")
        );
        await startSound.playAsync();
      } catch (error) {
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    },
    [conversation?.id, conversation?.membersPublicKey, session?.id, ConversationList, dispatch, reset]
  );

  /** Navigate to file picker */
  const navigateToSelectFile = useCallback(() => {
    navigation.navigate("MessageSelectFile" as never, { conversation });
  }, [navigation, conversation]);

  /** Cleanup typing events on unmount */
  useEffect(() => {
    return () => {
      typingSetter(false);
      onBlurTyping?.();
    };
  }, [typingSetter, onBlurTyping]);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.6%",
        gap: 6,
      }}
    >
      <Controller
        control={control}
        name="message"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            keyboardType="default"
            returnKeyType="done"
            placeholder="Type a message"
            multiline
            disabled={loading}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              onTyping();
            }}
            value={value}
            onSubmitEditing={handleSubmit(sendMessageHandle)}
            style={{
              flex: 1,
              borderRadius: 20,
              borderWidth: 0,
              maxHeight: 100,
            }}
            containerStyle={{ flexShrink: 1 }}
            rightSideComponent={
              <Icon
                iconName="ImagePlus"
                variant="secondary"
                iconColorVariant="secondary"
                size={28}
                disabled={loading}
                onPress={navigateToSelectFile}
                style={{
                  padding: "4%",
                  height: 45,
                  aspectRatio: 1,
                }}
              />
            }
          />
        )}
      />

      <View style={{ height: 45 }}>
        <Icon
          iconName="Send"
          isButton
          size={26}
          disabled={loading}
          onPress={handleSubmit(sendMessageHandle)}
          style={{
            height: 45,
            aspectRatio: 1,
          }}
        />
      </View>
    </View>
  );
});

export default ChatScreenInput;