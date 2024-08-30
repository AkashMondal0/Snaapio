
import React, { FC, createContext, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyStatusBar from '../components/shared/status-bar';
import { RootState } from '../redux/store';
import { fetchProfileData } from '../redux/slice/profile';
import {
    addToPrivateChatList, addToPrivateChatListMessage,
    addToPrivateChatListMessageSeen, addToPrivateChatListMessageTyping,
    getProfileChatList
} from '../redux/slice/private-chat';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from '../utils/socket-connect';
import { PrivateMessage, PrivateMessageSeen } from '../types/private-chat';
import { Login, Logout } from '../redux/slice/auth';
import NetInfo from '@react-native-community/netinfo'
import { ToastAndroid } from 'react-native';
import { addToGroupChatListMessage, addToGroupChatListMessageSeen, getGroupChatList } from '../redux/slice/group-chat';

SplashScreen.preventAutoHideAsync();

interface ProfileContextType {
    fetchUserData?: () => void
}

const ProfileContext = createContext<ProfileContextType>({});
export { ProfileContext };


interface Profile_ProviderProps {
    children: React.ReactNode
}
const Profile_Provider: FC<Profile_ProviderProps> = ({
    children
}) => {
    const dispatch = useDispatch()
    const { isLogin, token } = useSelector((state: RootState) => state.authState)



    const fetchUserData = useCallback(async () => {
        const token = await AsyncStorage.getItem("token")
        await dispatch(fetchProfileData(token) as any)
        SplashScreen.hideAsync()
    }, [])


    useEffect(() => {
        fetchUserData()
        socket.on("update_Chat_List_Receiver", async (data) => {
            dispatch(addToPrivateChatList(data.chatData) as any)
        })

        socket.on("message_receiver", (data: PrivateMessage) => {
            dispatch(addToPrivateChatListMessage(data))
        })

        socket.on("message_seen_receiver", (data: PrivateMessageSeen) => {
            dispatch(addToPrivateChatListMessageSeen(data))
        })
        socket.on("message_typing_receiver", (data) => {
            dispatch(addToPrivateChatListMessageTyping(data))
        })

        socket.on("group_message_receiver", (data: PrivateMessage) => {
            dispatch(addToGroupChatListMessage(data))
        })

        socket.on("group_chat_connection_receiver", async (data) => {
            const token = await AsyncStorage.getItem("token")
            dispatch(getGroupChatList(token) as any)
        })

        socket.on("group_message_seen_receiver", (data: PrivateMessageSeen) => {
            dispatch(addToGroupChatListMessageSeen(data))
        })

        return () => {
            socket.off("update_Chat_List_Receiver")
            socket.off("message_receiver")
            socket.off("message_seen_receiver")
            socket.off("message_typing_receiver")
            socket.off("group_message_receiver")
            socket.off("group_chat_connection_receiver")
            socket.off("group_message_seen_receiver")
            // unsubscribe();
        }
    }, [])

    return (
        <ProfileContext.Provider value={{
            fetchUserData
        }}>
            <MyStatusBar translucent />

            {children}
        </ProfileContext.Provider>
    );
};

export default Profile_Provider;