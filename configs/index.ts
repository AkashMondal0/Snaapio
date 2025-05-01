const _configs = {
    sessionName: "Snaapio-sessionName",
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
            // prepareSession: "prepare-session",
            // joinSession: "join-session",
            // currentRoom: "current-room",
            // sendOffer: "send-offer",
            // sendAnswer: "send-answer",
            // sendIceCandidate: "send-ice-candidate",
            // toggleAction: "toggle-action", // toggle-video,toggle-muted,toggle-video                
            // sendEmoji: "send-emoji",
            // sendChat: "send-chat",
            // hangUp: "hang-up",
            // // client
            // error: "error",
            // sessionInfo: "session-info",
            // allParticipants: "all-participants",
            // newParticipant: "new-participant",
            // receiveOffer: "receive-offer",
            // receiveAnswer: "receive-answer",
            // receiveIceCandidate: "receive-ice-candidate",
            // emojiUpdate: "emoji-update",
            // receiveChat: "receive-chat",
            // participantActionUpdate: "participant-action-update",
            // participantLeft: "participant-left",
        }
    },
    AppDetails: {
        version: "0.1.5",
        name: "Snaapio",
        description: "Snaapio is a social media platform that allows users to share their thoughts and ideas with the world.",
        appUrl: '',
        logoUrl: "/primary-logo.png",
        primaryLightLogo: "/primary-light-logo.jpeg",
        creator: "@AkashMondal",
        category: "social media",
    }
}

export const configs = Object.freeze(_configs)