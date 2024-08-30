import React, { useState, useContext, useCallback, useEffect, useMemo, memo } from 'react';
import { Animated, View, Text, TouchableOpacity, Button, ToastAndroid, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AnimatedContext } from '../../../provider/Animated_Provider';
import StatusHeader from './components/header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { FlashList } from "@shopify/flash-list";
import SingleCard from '../../../components/shared/Single-Card';
import FloatingButton from '../../../components/shared/Floating';
import { Camera } from 'lucide-react-native';
import uid from '../../../utils/uuid';
// import { getFriendStatuses } from '../../../redux/slice/status';
import privateChat, { getProfileChatList } from '../../../redux/slice/private-chat';
import { Assets, Status, User } from '../../../types/profile';
import { timeFormat } from '../../../utils/timeFormat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

interface StatusScreenProps {
  navigation?: any
}
const StatusScreen = ({ navigation }: StatusScreenProps) => {
  const AnimatedState = useContext(AnimatedContext)
  const useProfile = useSelector((state: RootState) => state.profile)
  const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
  const { friendListWithDetails, loading } = useSelector((state: RootState) => state.privateChat)
  const dispatch = useDispatch()

  const handleNavigation = useCallback(() => {
    navigation.navigate('CameraScreen', {
      type: "status"
    })
  }, [])

  const ViewStatus = useCallback((data: { user: User, statuses: Status[] }) => {
    if (data.statuses.length === 0) {
      handleNavigation()
    }
    else {
      navigation.navigate('ViewStatus', {
        assets: data.statuses,
        user: data.user,
      })
    }
  }, [])

  const Status = friendListWithDetails.map((friend) => {
    return {
      user: friend,
      status: friend?.status?.flatMap((status) => status) || []
    }
  }) || []

  const fetchStatus = useCallback(async () => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      await dispatch(getProfileChatList(token) as any)
    } else {
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
    }
  }, [])

  return (
    <Animated.View style={{
      flex: 1,
      backgroundColor: AnimatedState.backgroundColor
    }}>
      <StatusHeader theme={useTheme}
        navigation={navigation}
        AnimatedState={AnimatedState} />

      <FlashList
        estimatedItemSize={50}
        getItemType={(item) => item?.user?._id}
        data={Status}
        keyExtractor={(item) => item?.user?._id}
        renderItem={({ item }) => {
          const user = item?.user
          const status = item?.status
          if (!user) {
            return null
          }
          if (!status) {
            return null
          }
          return <View style={{
            flex: 1,
          }}>
            {
              status.length >= 1 ?
                <SingleCard
                  label={user?.username || ''}
                  subTitle={timeFormat(status[status?.length - 1]?.createdAt).toString()}
                  backgroundColor={false}
                  elevation={0}
                  avatarSize={55}
                  avatarUrl={status[status.length - 1]?.url}
                  onPress={() => { ViewStatus({ user: user, statuses: item?.status } as any) }}
                  height={70} /> : null
            }
          </View>
        }}
        ListHeaderComponent={() => {
          const myStatuses = useProfile.user?.status?.flatMap((status) => status)
          const logo = () => {
            if (myStatuses) {
              return myStatuses[myStatuses?.length - 1]?.url || useProfile.user?.profilePicture
            }
            else {
              return useProfile.user?.profilePicture
            }
          }
          return <>
            <SingleCard label={"My Status"}
              subTitle='Today, 10:00 PM'
              backgroundColor={false}
              elevation={0}
              avatarSize={55}
              avatarUrl={logo()}
              onPress={() => {
                ViewStatus({
                  user: useProfile.user,
                  statuses: useProfile.user?.status?.flatMap((status) => status)
                } as any)
              }}
              height={70} />
            <View style={{
              height: 40,
              justifyContent: "center",
              paddingHorizontal: 15,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: "bold",
                color: useTheme.textColor,
              }}>Recent Updates</Text>
            </View>
          </>
        }}
        refreshing={loading}
        onRefresh={fetchStatus}
      />
      <FloatingButton
        onPress={handleNavigation}
        theme={useTheme}
        icon={<Camera color={useTheme.color}
          size={35} />} />
    </Animated.View>
  );
}

export default memo(StatusScreen);