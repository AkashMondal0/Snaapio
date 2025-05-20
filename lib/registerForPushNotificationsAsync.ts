import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getSecureStorage, setSecureStorage } from './SecureStore';
import { configs } from '@/configs';
import { Session } from '@/types';

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const isNotificationId = await getSecureStorage<string>(configs.notificationName, "string");
    // // get local storage key 
    // if (isNotificationId) {
    //   // console.log("isNotificationId", isNotificationId);
    //   return isNotificationId;
    // }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      if (pushTokenString === isNotificationId) return;
      setSecureStorage(configs.notificationName, pushTokenString)
      // console.log("pushTokenString", pushTokenString);
      
       const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
      if (!BearerToken?.accessToken) {
        console.error("Error retrieving token from SecureStorage")
        return;
      };

      await fetch(`${configs.serverApi.baseUrl}/notification/${pushTokenString}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Authorization': `${BearerToken.accessToken}`,
        },
        cache: 'no-cache',
      });
      // send to server
      return
    } catch (e: unknown) {
      console.error("Error Notification update")
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}