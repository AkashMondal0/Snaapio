import React, { FC, Suspense } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { CurrentTheme } from '../../../../types/theme';
import { File } from '../../../../types/private-chat';
import { timeFormat } from '../../../../utils/timeFormat';
import { ResizeMode, Video } from 'expo-av';

interface MessageVideoProps {
    sender: boolean
    theme: CurrentTheme
    seen?: boolean
    file: File
    time: string
    onPress?: () => void
}
const MessageVideo: FC<MessageVideoProps> = ({
    theme,
    sender,
    seen,
    time,
    file,
    onPress
}) => {
    const senderColor = theme.primary;
    const receiverColor = theme.background;
    const textColor = sender ? theme.color : theme.textColor;
    const video = React.useRef<any>(null);
    const [status, setStatus] = React.useState<any>(null);

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
                <Suspense>
                    <Video
                        ref={video}
                        style={{
                            width: 250,
                            maxHeight: 350,
                            height: 350,
                            borderRadius: 20,
                        }}
                        isLooping={false}
                        source={{ uri: file.url }}
                        useNativeControls
                        audioPan={0}
                        resizeMode={ResizeMode.COVER}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                </Suspense>

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

export default MessageVideo;