const _configs = {
    // appUrl: process.env.NEXTAUTH_URL,
    sessionName: "skylight-session",
    serverApi: {
        baseUrl: "https://skylight-server-api.onrender.com/v1",
        // baseUrl: "http://192.168.31.212:5000/v1",
    },
    routesNames: {
        home: "/",
        auth: {
            index: "/auth",
            login: "/auth/login",
            register: "/auth/register",
            forgotPassword: "/auth/forgot-password",
            resetPassword: "/auth/reset-password",
            verifyEmail: "/auth/verify-email",
        },
        settings: {
            index: "settings",
            theme: "settings/theme",
            account: "settings/account",
            profile: "settings/profile",
            security: "settings/security",
            notification: "settings/notification",
            privacy: "settings/privacy",
            blockedUsers: "settings/blocked-users",
            help: "settings/help",
        },
    },
    eventNames: {
        conversation: {
            message: "conversation_message",
            seen: "conversation_message_seen",
            typing: "conversation_user_keyboard_pressing",
            listRefetch: "conversation_list_refetch",
        },
        notification: {
            post: "notification_post",
            followRequest: {}
        },
    },
    firebaseConfig: {
        // apiKey: process.env.FIREBASE_API_KEY,
        // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        // projectId: process.env.FIREBASE_PROJECT_ID,
        // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        // appId: process.env.FIREBASE_APP_ID
    },
    AppDetails: {
        version: "1.0.0",
        name: "Skylight",
        description: "SkyLight is a social media platform that allows users to share their thoughts and ideas with the world.",
        appUrl: '',
        logoUrl: "/primary-logo.png",
        primaryLightLogo: "/primary-light-logo.jpeg",
        creator: "@AkashMondal",
        category: "social media",
    }
}

export const configs = Object.freeze(_configs)