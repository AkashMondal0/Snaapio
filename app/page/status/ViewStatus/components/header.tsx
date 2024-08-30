import { FC, memo } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react-native';
import React from 'react';
import { CurrentTheme } from '../../../../../types/theme';
import Avatar from '../../../../../components/shared/Avatar';
import { timeFormat } from '../../../../../utils/timeFormat';


interface HeaderChatProps {
    avatarUrl?: string,
    name?: string,
    lastSeen?: string,
    onBackPress?: () => void,
    theme: CurrentTheme,
    secondaryOnPress?: () => void,
    primaryOnPress?: () => void,
    isOnline?: boolean,
    isTyping?: boolean,
    navigation?: any
    time?: string | number | Date
}
const HeaderChat: FC<HeaderChatProps> = ({
    avatarUrl,
    name,
    lastSeen,
    onBackPress,
    theme,
    secondaryOnPress,
    primaryOnPress,
    isOnline,
    isTyping,
    navigation,
    time
}) => {
    const backgroundColor = theme.background;
    const iconColor = theme.iconColor;
    const TextColor = theme.textColor;


    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            height: 80,
            paddingTop: StatusBar.currentHeight,
            paddingHorizontal: 15,
            zIndex: 100,
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
            }}>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start"
                    }}
                    onPress={onBackPress}>
                    <ArrowLeft
                        size={25}
                        color={iconColor}
                    />
                    <Avatar size={45}
                        style={{
                            marginHorizontal: 5,
                        }}
                        url={avatarUrl}
                        border
                        text={name?.charAt(0).toUpperCase()}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}>
                    <View style={{
                        flexDirection: "column",
                    }}>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 16,
                            color: TextColor,
                        }}>{name}</Text>
                        <Text style={{
                            fontSize: 14,
                            color: TextColor,
                        }}>{timeFormat(time as any)}</Text>
                    </View>
                </TouchableOpacity>

            </View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 1,
                gap: 15,
            }}>
                {/* <TouchableOpacity>
                    <Video size={30}
                        color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Phone size={25}
                        color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={primaryOnPress}>
                    <MoreVertical size={25}
                        color={iconColor} />
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

export default memo(HeaderChat);
