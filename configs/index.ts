const _configs = {
    sessionName: "skylight-session",
    themeName: "skysolo-theme",
    serverApi: {
        baseUrl: process.env.EXPO_PUBLIC_SERVER_URL,
        supabaseStorageUrl: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL,
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
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
    AppDetails: {
        version: "0.0.1",
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