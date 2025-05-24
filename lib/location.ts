import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';

export async function getCurrentLocation() {

    if (Platform.OS === 'android' && !Device.isDevice) {
        throw new Error('Oops, this will not work on Snack in an Android Emulator. Try it on your device!');
    };

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
    };

    const location = await Location.getCurrentPositionAsync({});
    return {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
    }
}

type Coordinates = { lat: number; lon: number } | null;

export function useCurrentLocation() {
  const [location, setLocation] = useState<Coordinates>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  

  const fetchLocation = useCallback(async () => {
    try {
      if (Platform.OS === 'android' && !Device.isDevice) {
        throw new Error('Not supported on Android emulators in Expo Snack.');
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied.');
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
      });
      // setStatus(true)
    } catch (err: any) {
      setError(err.message || 'Failed to get location.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return useMemo(
    () => ({ location, error, loading }),
    [location, error, loading]
  );
}