import { FC, useCallback, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Text, Pressable, Animated } from 'react-native';
import React from 'react';
import { truncate } from 'lodash';
import { CurrentTheme } from '../../../../types/theme';
import Avatar from '../../../../components/shared/Avatar';
import { timeFormat } from '../../../../utils/timeFormat';
import { User } from '../../../../types/profile';
import Padding from '../../../../components/shared/Padding';
import socket from '../../../../utils/socket-connect';
import { useDispatch, useSelector } from 'react-redux';
import { setUserStatus } from '../../../../redux/slice/private-chat';
import { GroupConversation, PrivateChat, PrivateMessage } from '../../../../types/private-chat';
import { RootState } from '../../../../redux/store';
import { AnimatedContext } from '../../../../provider/Animated_Provider';

interface GroupConversationCardProps {
    data: GroupConversation,
    navigation: any
}
const GroupConversationCard: FC<GroupConversationCardProps> = ({
    data,
    navigation
}) => {
    const dispatch = useDispatch()
    const useProfile = useSelector((state: RootState) => state.profile)
    const theme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const AnimatedState = useContext(AnimatedContext)

    const seenCount = useCallback((messages?: PrivateMessage[]) => {
        return messages && [...messages]?.map(item => {
            if (!item.seenBy.includes(useProfile?.user?._id as string)) {
                return item._id
            }
        }).filter(item => item !== undefined).length
    }, [useProfile?.user?._id])

    const navigateToChat = useCallback(() => {
        navigation.navigate("Group_chat", {
            groupId: data._id,
        })
    }, [])

    const sortedNewDate = (messages: PrivateMessage[]) => {
        return messages && [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    }

    const title = data.name as string
    const avatarUrl = data.picture
    const lastMessage = data.messages && data.messages.length > 0 ? sortedNewDate(data?.messages)?.content : "New group"
    const date = data.messages && data.messages.length > 0 ? sortedNewDate(data?.messages).createdAt : data.createdAt
    const isSeen = seenCount(data?.messages)
    const isTyping = data?.typing


    return (
        <Animated.View style={{
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: AnimatedState.backgroundColor,
        }}>
            <Pressable
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 20,
                    paddingVertical: 12,
                    paddingLeft: 5,
                    width: '100%',
                }}
                onPress={navigateToChat}
                android_ripple={{
                    color: theme.selectedItemColor,
                }}>
                <>
                    <TouchableOpacity
                    // onPress={avatarOnPress}
                    >
                    </TouchableOpacity>
                    <Avatar
                        size={55}
                        style={{
                            marginHorizontal: 5,
                        }}
                        text={title[0]}
                        url={avatarUrl as string} />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: 'flex-start',
                            paddingHorizontal: 10,
                        }}>
                        <View>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '600',
                                color: theme.textColor,
                            }}>{truncate(title, { separator: "...", length: 14 })}</Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    color: isTyping ? theme.primary : theme.subTextColor,
                                }}
                            >{isTyping ? "typing..." : truncate(lastMessage, {
                                length: 15,
                                separator: '...',
                            })}
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            paddingHorizontal: 10,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '400',
                                color: theme.subTextColor,
                            }}>{timeFormat(date)}</Text>
                            {isSeen && isSeen > 0 ?
                                <View style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 100,
                                    backgroundColor: theme.primary,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: theme.color,
                                    }}>{isSeen}</Text>
                                </View>
                                : <Padding size={25} />}
                        </View>
                    </View>
                </>
            </Pressable>
        </Animated.View>
    )
};

export default GroupConversationCard;