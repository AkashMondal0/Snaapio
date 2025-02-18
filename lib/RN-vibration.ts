import { Platform, Vibration } from 'react-native';

const ONE_SECOND_IN_MS = 1000;

const VIBRATION_PATTERNS: Record<VibrationMode, number[]> = {
  Soft: [100],
  Light: [200],
  Medium: [300, 100, 300],
  Heavy: [500, 200, 500],
  Rigid: [700],
  Warning: [100, 200, 100, 200],
  Error: [500, 300, 500, 300],
  Success: [200, 100, 200],
};

type VibrationMode = 'Soft' | 'Light' | 'Medium' | 'Heavy' | 'Rigid' | 'Warning' | 'Error' | 'Success';

const vibrate = (mode: VibrationMode = 'Medium') => {
  const pattern = VIBRATION_PATTERNS[mode];

  if (Platform.OS === 'android') {
    Vibration.vibrate(pattern.length > 1 ? pattern : pattern[0], false);
  } else {
    Vibration.vibrate(pattern);
  }
};


export default vibrate;
export const hapticVibrate = () => Vibration.vibrate(1 * 50, false);
