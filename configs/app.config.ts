// import { ExpoConfig, ConfigContext } from 'expo/config';

// export default ({ config }: ConfigContext): ExpoConfig => ({
//   ...config,
//   slug: 'skylight',
//   name: 'Skylight',
//   orientation: 'default',
//   icon: "./assets/icon.png",
//   userInterfaceStyle: "automatic",
//   assetBundlePatterns: [
//     "**/*"
//   ],
//   splash: {
//     image: './assets/splash.png',
//     resizeMode: 'cover',
//     backgroundColor: '#ffffff',
//   },
//   android: {
//     splash: {
//       image: "./assets/splash.png",
//       resizeMode: "cover",
//       backgroundColor: "#ffffff",
//       dark: {
//         image: "./assets/splash.png",
//         resizeMode: "cover",
//         backgroundColor: "#000000",
//       }
//     },
//     package: "com.akashmondal0.skylight",
//     permissions: [
//       "android.permission.RECORD_AUDIO",
//       "android.permission.MODIFY_AUDIO_SETTINGS",
//       "android.permission.CAMERA",
//       "android.permission.READ_EXTERNAL_STORAGE",
//       "android.permission.WRITE_EXTERNAL_STORAGE",
//       "android.permission.ACCESS_MEDIA_LOCATION",
//       "android.permission.INTERNET",
//     ]
//   },
//   extra: {
//     eas: {
//       projectId: "4a5248dd-ed06-4672-a5f0-852393917930"
//     }
//   },
//   plugins: [
//     [
//       "expo-build-properties",
//       {
//         "android": {
//           "usesCleartextTraffic": true
//         }
//       }
//     ],
//     [
//       "expo-image-picker",
//       {
//         "photosPermission": "The app accesses your photos to let you share them with your friends."
//       }
//     ],
//     [
//       "expo-av",
//       {
//         "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
//       }
//     ],
//     [
//       "expo-camera",
//       {
//         "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
//         "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
//         "recordAudioAndroid": true
//       }
//     ],
//     [
//       "expo-media-library",
//       {
//         "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
//         "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
//         "isAccessMediaLocationEnabled": true
//       }
//     ],
//   ],
//   owner: "akashmondal0"
// });