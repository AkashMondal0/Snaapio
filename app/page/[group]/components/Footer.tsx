import React, { FC, memo, useCallback, useContext, useEffect, useRef } from 'react';
import { Keyboard, TextInput, ToastAndroid, View } from 'react-native';
import { Camera, Paperclip, Send, Smile } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CurrentTheme } from '../../../../types/theme';
import { User } from '../../../../types/profile';
import { GroupConversation, PrivateChat, typingState } from '../../../../types/private-chat';
import socket from '../../../../utils/socket-connect';
import MyButton from '../../../../components/shared/Button';
import { ProfileContext } from '../../../../provider/Profile_Provider';
import Icon_Button from '../../../../components/shared/IconButton';
import { Audio } from 'expo-av';
import { debounce } from 'lodash';
import { sendMessageGroup } from '../../../../redux/slice/group-chat';



interface FooterChatProps {
  theme: CurrentTheme
  profile?: User | null
  conversation?: GroupConversation | null
  navigation?: any
}
const FooterChat: FC<FooterChatProps> = ({
  theme,
  profile,
  conversation,
  navigation,
}) => {
  const _color = theme.textColor
  const backgroundColor = theme.background
  const dispatch = useDispatch()
  const inputRef = useRef<any>(null);
  const profileState = useContext(ProfileContext) as any
  const [stopTyping, setStopTyping] = React.useState(true)

  const playSound = useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../../../assets/audio/pop.mp3'), {
      volume: 0.5,
    });
    await sound.playAsync();
  }, [])

  const { control, handleSubmit, reset,
    formState: { errors } } = useForm({
      defaultValues: {
        message: "",
      }
    });

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current.blur();
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  const onFocus = useCallback(() => {
    // const message: typingState = {
    //   conversationId: conversation?._id as string,
    //   senderId: profile?._id as string,
    //   // receiverId: user?._id as string,
    //   typing: true
    // }
    // socket.emit('message_typing_sender', message)
  }, [])

  const onBlurType = useCallback(() => {
    // const message: typingState = {
    //   conversationId: conversation?._id as string,
    //   senderId: profile?._id as string,
    //   // receiverId: user?._id as string,
    //   typing: false
    // }
    // socket.emit('message_typing_sender', message)
    // setStopTyping(true)
  }, [])

  const debouncedHandleOnblur = useCallback(debounce(onBlurType, 2000), []);


  const sendMessageHandle = useCallback(async (data: { message: string }) => {

    if (conversation && profile && conversation.members) {
      const _data = {
        conversationId: conversation._id as string,
        content: data.message,
        member: profile,
        receiverIds: conversation.members.map((member) => member.userId),
        assets: []
      }
      reset()
      dispatch(sendMessageGroup(_data) as any)
      playSound()
    } else {
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
    }
  }, [])

  const sendPhoto = useCallback(async () => {

      navigation.navigate('CameraScreen', {
        type: "message",
        forDirectMessage: {
          conversationId: conversation?._id as string,
          content: "Photo",
          member: profile,
          receiver: null,
          receiverIds: conversation?.members?.map((member) => member.userId) as string[],
        }
      })
  
  }, [])



  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      gap: 10,
    }}>
      <View style={{
        backgroundColor: backgroundColor,
        // width: "85%",
        flex: 1,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        maxHeight: 100,
        paddingHorizontal: 5,
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          elevation: 5,
          gap: 10,
        }}>
          <Icon_Button
            theme={theme}
            backgroundEnable={false}
            onPress={() => {
              // emoji
              ToastAndroid.show("Emoji coming soon", ToastAndroid.SHORT)
            }}
            size={40}
            icon={<Smile
              size={30} color={theme.iconColor} />} />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={() => {
                  onBlur()
                  Keyboard.dismiss()
                  onBlurType()
                }}
                onChangeText={(e) => {
                  onChange(e)
                  if (stopTyping) {
                    onFocus()
                    setStopTyping(false)
                  } else {
                    debouncedHandleOnblur()
                  }
                }}
                ref={inputRef}
                value={value}
                multiline
                style={{
                  minHeight: 50,
                  width: "85%",
                  borderRadius: 100,
                  color: _color,
                  fontSize: 18,
                  flex: 1,
                }}
                placeholder="Message"
                placeholderTextColor={_color} />)}
            name="message" />
          <Icon_Button
            theme={theme}
            backgroundEnable={false}
            onPress={sendPhoto}
            size={40}
            icon={<Camera
              size={30} color={theme.iconColor} />} />
        </View>
      </View>
      <View style={{
        zIndex: 1000,
      }}>
        <MyButton theme={theme}
          onPress={handleSubmit(sendMessageHandle)}
          variant="primary"
          radius={100}
          padding={8}
          width={60}
          elevation={5}
          icon={<Send size={30} color={theme.color} />} />
      </View>
    </View>
  );
};

export default FooterChat