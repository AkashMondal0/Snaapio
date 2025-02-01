import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Snaapio",
  slug: "snaapio",
  scheme: "snaapio",
  platforms: ["android"],
  version: "0.1.0",
  orientation: "default",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/adaptive-icon.png",
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
      image: "./assets/adaptive-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      dark: {
        backgroundColor: "#000000",
        image: "./assets/adaptive-icon.png",
        resizeMode: "contain"
      }
    },
    package: "com.akashmondal0.snaapio",
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "snaapio.vercel.app",
            pathPrefix: "/*"
          },
        ],
        category: [
          "BROWSABLE",
          "DEFAULT"
        ]
      }
    ],
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
      projectId: "0b900a43-57ae-4ed2-8fb9-9eb29fa77ddb"
    }
  },
  plugins: [
    [
      "expo-splash-screen",
      {
        "backgroundColor": "#ffffff",
        "image": "./assets/adaptive-icon.png",
        "dark": {
          "image": "./assets/adaptive-icon.png",
          "backgroundColor": "#000000",
        },
        "imageWidth": 200
      }
    ],
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
    ],
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone."
      }
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true
      }
    ]
  ],
  owner: "akashmondal0"
});