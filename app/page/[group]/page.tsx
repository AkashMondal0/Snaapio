import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { Navigation, Route } from '../../../types';
import { RootState } from '../../../redux/store';
import Wallpaper_Provider from '../../../provider/Wallpaper_Provider';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import HeaderChat from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';



interface ChatScreenProps {
    navigation: Navigation
    route: {
        params: {
            groupId: string
        }
    }
}

const GroupChatScreen = ({ navigation, route: { params } }: ChatScreenProps) => {
    const useThem = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const { groupChatList, loading, error } = useSelector((state: RootState) => state.groupChat)
    const profile = useSelector((state: RootState) => state.profile)
    const AnimatedState = useContext(AnimatedContext)

    let groupConversationData = useMemo(() => groupChatList.find((group) => group._id === params.groupId), [groupChatList])


    const onBlurType = useCallback(() => {
        navigation.goBack()
    }, [])

    const onPressSetting = useCallback(() => {

    }, [])

    if (!groupConversationData) {
        return <Text>Chat Id Not Found</Text>
    }

    const groupName = groupConversationData?.name
    const groupImage = groupConversationData?.picture


    return (
        <SafeAreaView style={{
            flex: 1,
            paddingTop: StatusBar.currentHeight,
        }}>
            <HeaderChat
                AnimatedState={AnimatedState}
                primaryOnPress={onPressSetting}
                theme={useThem}
                // isOnline={userData?.isOnline}
                // isTyping={PrivateConversationData?.typing}
                onBackPress={onBlurType}
                name={groupName}
                avatarUrl={groupImage} />
            <Wallpaper_Provider
                url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQna04gO0p2_R_rVFkUwDIzVv7vUW--j10UWw&usqp=CAU'
                defaultWallpaper
                backgroundColor={useThem.borderColor}>
                <Body
                    messageLoading={loading}
                    error={error}
                    conversation={groupConversationData}
                    profile={profile.user}
                    messages={groupConversationData?.messages || []}
                    theme={useThem} />
                <Footer theme={useThem}
                    navigation={navigation}
                    conversation={groupConversationData}
                    profile={profile.user} />
            </Wallpaper_Provider>
        </SafeAreaView>
    )
}

export default GroupChatScreen