import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { CurrentTheme } from '../../../../types/theme';
import { File } from '../../../../types/private-chat';
import { timeFormat } from '../../../../utils/timeFormat';
import { ResizeMode, Video } from 'expo-av';
import MessageImage from './MessageImage';
import MessageVideo from './MessageVideo';
import { useNavigation } from '@react-navigation/native';
import { User } from '../../../../types/profile';

interface MessageTypeProps {
    sender: boolean
    theme: CurrentTheme
    seen?: boolean
    files: File[]
    time: string
    receiver?: User,
    senderData?: User
}
const MessageType: FC<MessageTypeProps> = ({
    theme,
    sender,
    seen,
    files,
    time,
    receiver,
    senderData
}) => {
    const navigation = useNavigation()

    return (
        <>{
            files.map((file, index) => {
                if (file.type === "image") {
                    return <MessageImage key={index}
                        onPress={() => {
                            navigation.navigate("AssetsScreen", {
                                asset: file,
                                user: senderData,
                                time: time
                            })
                        }}
                        file={file} 
                        sender={sender} 
                        seen={seen}
                        senderData={senderData}
                        theme={theme} time={time} />
                }
                else if (file.type === "video") {
                    return <MessageVideo key={index}
                        onPress={() => {
                            navigation.navigate("AssetsScreen", {
                                asset: file,
                                user: senderData,
                                time: time
                            })
                        }}
                        file={file} 
                        sender={sender}
                        senderData={senderData}
                        seen={seen} 
                        theme={theme} time={time} />
                }
            })
        }</>
    );
};

export default MessageType;