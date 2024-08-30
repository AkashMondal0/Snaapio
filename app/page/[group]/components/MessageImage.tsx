import React, { FC } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CheckCheck} from 'lucide-react-native';
import { CurrentTheme } from '../../../../types/theme';
import { File } from '../../../../types/private-chat';
import { timeFormat } from '../../../../utils/timeFormat';
import { ResizeMode, Video } from 'expo-av';
import { User } from '../../../../types/profile';

interface MessageImageProps {
    sender: boolean
    theme: CurrentTheme
    seen?: boolean
    file: File
    time: string
    senderData?:User
    onPress?: () => void
}
const MessageImage: FC<MessageImageProps> = ({
    theme,
    sender,
    seen,
    file,
    time,
    senderData,
    onPress
}) => {
    const senderColor = theme.primary;
    const receiverColor = theme.background;
    const textColor = sender ? theme.color : theme.textColor;

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: sender ? "flex-end" : "flex-start",
            padding: 8,
        }}>
            <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={{
                backgroundColor: sender ? senderColor : receiverColor,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderTopLeftRadius: !sender ? 0 : 20,
                borderTopRightRadius: !sender ? 20 : 0,
                padding: 5,
                maxWidth: "80%",
                elevation: 2,
                gap: 5,
            }}>
                <Text style={{
                    color: textColor,
                    fontSize: 16,
                    fontWeight: "bold",
                }}>
                    {senderData?.username}
                </Text>
                <Image source={{ uri: file.url }} style={{
                    width: 250,
                    maxHeight: 350,
                    height: 350,
                    borderRadius: 20,
                    resizeMode: "cover",
                }} />

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 15,
                }}>
                    <Text style={{
                        color: textColor,
                        fontSize: 12,
                    }}>
                        {timeFormat(time)}
                    </Text>
                    <CheckCheck
                        size={20}
                        color={seen ? theme.seen : theme.iconColor} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default MessageImage;