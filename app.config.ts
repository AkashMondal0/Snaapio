import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Sky Light",
  slug: "skylight",
  version: "1.0.0",
  orientation: "default",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      // dark:{
      //   backgroundColor: "#000000",
      //   image: "./assets/splash.png",
      //   resizeMode: "contain"
      // }
    },
    package: "com.akashmondal0.skylight",
    permissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.MODIFY_AUDIO_SETTINGS",
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.ACCESS_MEDIA_LOCATION"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "85422357-b49f-4b6c-8d74-593e530cdedd"
    }
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true
        }
      }
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you share them with your friends."
      }
    ],
    [
      "expo-av",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone."
      }
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
        recordAudioAndroid: true
      }
    ],
    [
      "expo-media-library",
      {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
        savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
        isAccessMediaLocationEnabled: true
      }
    ],
    [
      "expo-secure-store",
      {
        faceIDPermission: "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
      }
    ]
  ],
  owner: "skysolo"
});