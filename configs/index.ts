const _configs = {
    sessionName: "skylight-session",
    themeName: "skysolo-theme",
    serverApi: {
        baseUrl: process.env.EXPO_PUBLIC_SERVER_URL ?? "https://skylight-backend-latest.onrender.com/v1",
        supabaseStorageUrl: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL ?? "https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/",
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://srcsaekkccuublpzpsnb.supabase.co",
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyY3NhZWtrY2N1dWJscHpwc25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2NzIwMDEsImV4cCI6MjAzOTI0ODAwMX0.Ww-SmZsEMFARIromd8xZpMLvxPh8JfWLfE4Xwrk74Bs",
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