const _configs = {
    sessionName: "Snaapio-sessionName",
    notificationName: "Snaapio-notificationName",
    themeName: "Snaapio-themeName",
    themeSchema: "Snaapio-themeSchema",
    serverApi: {
        baseUrl: process.env.EXPO_PUBLIC_SERVER_URL,
        supabaseStorageUrl: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL,
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        // ai
        aiApiUrl: process.env.EXPO_PUBLIC_AI_API_URL,
        videoServerUrl: process.env.EXPO_PUBLIC_VIDEO_SERVER_URL
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
        webRtc: {
            offer: "offer",
            answer: "answer",
            candidate: "candidate",
            peerLeft: "peerLeft"
        },
        calling: {
            // server
            requestForCall: "request-for-call",
            answerIncomingCall: "answer-incoming-call",
            peerLeft: "peerLeft"
        }
    },
    AppDetails: {
        version: "0.1.6",
        name: "Snaapio",
        description: "Snaapio is a social media platform that allows users to share their thoughts and ideas with the world.",
        appUrl: 'https://snaapio.vercel.app',
        logoUrl: "/primary-logo.png",
        primaryLightLogo: "/primary-light-logo.jpeg",
        creator: "@AkashMondal",
        category: "social media",
        stripePk: process.env.EXPO_PUBLIC_STRIPE_PK
    }
}

export const configs = Object.freeze(_configs)