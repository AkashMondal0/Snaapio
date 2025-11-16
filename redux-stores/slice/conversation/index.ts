import {
    AiMessagePromptApi,
    conversationSeenAllMessage,
    CreateMessageApi,
    fetchConversationAllMessagesApi,
    fetchConversationApi,
    fetchConversationsApi,
} from "./api.service";
import { AIApiResponse, Conversation, Message, Typing } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "expo-media-library";
import { mergeConversations, upsertMessages } from "./merge";

/* ==================== HELPER FUNCTIONS ==================== */

/**
 * Efficiently adds authorId to seenBy array if not already present
 * Mutates the messages array for Redux Toolkit compatibility
 */
const updateSeenBy = (messages: Message[] | undefined, authorId: string | undefined): void => {
    if (!messages?.length || !authorId) return;
    
    for (const message of messages) {
        if (!message.seenBy.includes(authorId)) {
            message.seenBy.push(authorId);
        }
    }
};

/**
 * Updates conversation's last message metadata
 */
const updateConversationLastMessage = (
    conversation: Conversation,
    message: Message
): void => {
    conversation.lastMessageContent = message.content;
    conversation.lastMessageCreatedAt = message.createdAt;
};

/**
 * Finds conversation by ID with early return
 */
const findConversation = (
    conversations: Conversation[],
    conversationId: string
): Conversation | undefined => {
    return conversations.find((c) => c.id === conversationId);
};

/* ==================== TYPE DEFINITIONS ==================== */

export type LoadingType = "idle" | "pending" | "normal";

export interface AiMessage {
    id: string;
    data: AIApiResponse;
    createdAt: string;
    isAi: boolean;
    image: string | null;
}

interface ConversationStateType {
    // Conversation list
    conversationList: Conversation[];
    listLoading: LoadingType;
    listError: string | null;

    // Typing indicator
    currentTyping: Typing | null;

    // Create conversation
    createLoading: boolean;
    createError: string | null;

    // Create message
    createMessageLoading: boolean;
    createMessageError: string | null;

    // File uploads
    uploadFiles: Asset[];
    uploadFilesLoading: boolean;
    uploadFilesError: string | null;

    // AI messages
    ai_messages: AiMessage[];
    ai_messageLoading: boolean;
    ai_CurrentMessageId: string | null;
    ai_messageError: string | null;
    ai_messageCreateLoading: boolean;
}

/* ==================== INITIAL STATE ==================== */

const initialState: ConversationStateType = {
    conversationList: [],
    listLoading: "idle",
    listError: null,

    currentTyping: null,

    createLoading: false,
    createError: null,

    createMessageLoading: false,
    createMessageError: null,

    uploadFiles: [],
    uploadFilesLoading: false,
    uploadFilesError: null,

    ai_messages: [],
    ai_messageLoading: false,
    ai_messageError: null,
    ai_messageCreateLoading: false,
    ai_CurrentMessageId: null,
};

/* ==================== SLICE DEFINITION ==================== */

export const ConversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        /**
         * Merge new conversations into existing list
         */
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversationList = mergeConversations(
                state.conversationList,
                action.payload
            );
        },

        /**
         * Set current typing indicator
         */
        setTyping: (state, action: PayloadAction<Typing | null>) => {
            state.currentTyping = action.payload;
        },

        /**
         * Add new message to conversation and update metadata
         */
        setMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            const conversation = findConversation(
                state.conversationList,
                message.conversationId
            );

            if (conversation) {
                conversation.messages = upsertMessages(
                    conversation.messages,
                    [message]
                );
                updateConversationLastMessage(conversation, message);
                conversation.totalUnreadMessagesCount += 1;
            }
        },

        /**
         * Mark messages as seen by a specific user
         */
        setMessageSeen: (
            state,
            action: PayloadAction<{ conversationId: string; authorId: string }>
        ) => {
            const { conversationId, authorId } = action.payload;
            const conversation = findConversation(state.conversationList, conversationId);

            if (conversation) {
                updateSeenBy(conversation.messages, authorId);
            }
        },

        /**
         * Update message with uploaded images
         */
        setUploadImageInMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            const conversation = findConversation(
                state.conversationList,
                message.conversationId
            );

            if (conversation) {
                conversation.messages = upsertMessages(
                    conversation.messages,
                    [message]
                );
                updateConversationLastMessage(conversation, message);
            }
        },

        /**
         * Set files to be uploaded
         */
        setUploadFiles: (state, action: PayloadAction<Asset[]>) => {
            state.uploadFiles = action.payload;
        },

        /**
         * Clear upload files
         */
        clearUploadFiles: (state) => {
            state.uploadFiles = [];
        },

        /**
         * Save user's AI prompt
         */
        saveMyPrompt: (state, action: PayloadAction<AiMessage>) => {
            state.ai_messages.unshift(action.payload);
            state.ai_CurrentMessageId = action.payload.id;
            state.ai_messageCreateLoading = false;
        },

        /**
         * Mark AI message generation as complete
         */
        completeAiMessageGenerate: (state) => {
            state.ai_CurrentMessageId = null;
            state.ai_messageCreateLoading = false;
        },

        /**
         * Load historical AI prompts
         */
        loadMyPrompt: (state, action: PayloadAction<AiMessage[]>) => {
            state.ai_messages.push(...action.payload.reverse());
        },

        /**
         * Clear AI message error
         */
        clearAiMessageError: (state) => {
            state.ai_messageError = null;
        },

        /**
         * Reset entire conversation state to initial values
         */
        resetConversationState: () => initialState,

        /**
         * Update unread count for a conversation
         */
        updateUnreadCount: (
            state,
            action: PayloadAction<{ conversationId: string; count: number }>
        ) => {
            const { conversationId, count } = action.payload;
            const conversation = findConversation(state.conversationList, conversationId);

            if (conversation) {
                conversation.totalUnreadMessagesCount = count;
            }
        },

        /**
         * Remove a conversation from the list
         */
        removeConversation: (state, action: PayloadAction<string>) => {
            state.conversationList = state.conversationList.filter(
                (c) => c.id !== action.payload
            );
        },
    },

    extraReducers: (builder) => {
        /* ==================== fetchConversationsApi ==================== */
        builder
            .addCase(fetchConversationsApi.pending, (state) => {
                state.listLoading = "pending";
                state.listError = null;
            })
            .addCase(fetchConversationsApi.fulfilled, (state, action) => {
                state.conversationList = mergeConversations(
                    state.conversationList,
                    action.payload
                );
                state.listLoading = "normal";
                state.listError = null;
            })
            .addCase(fetchConversationsApi.rejected, (state, action) => {
                state.listLoading = "idle";
                state.listError = action.error.message ?? "Failed to fetch conversations";
            });

        /* ==================== fetchConversationApi ==================== */
        builder
            .addCase(fetchConversationApi.pending, (state) => {
                // Optional: Add loading state for single conversation
            })
            .addCase(fetchConversationApi.fulfilled, (state, action) => {
                state.conversationList = mergeConversations(
                    state.conversationList,
                    [action.payload]
                );
            })
            .addCase(fetchConversationApi.rejected, (state, action) => {
                console.error("Failed to fetch conversation:", action.error);
            });

        /* ==================== fetchConversationAllMessagesApi ==================== */
        builder
            .addCase(fetchConversationAllMessagesApi.pending, (state) => {
                // Loading handled in component
            })
            .addCase(fetchConversationAllMessagesApi.fulfilled, (state, action) => {
                if (!action.payload?.length) return;

                const conversationId = action.payload[0].conversationId;
                const conversation = findConversation(
                    state.conversationList,
                    conversationId
                );

                if (conversation) {
                    conversation.messages = upsertMessages(
                        conversation.messages,
                        action.payload
                    );
                }
            })
            .addCase(fetchConversationAllMessagesApi.rejected, (state, action) => {
                console.error("Failed to fetch messages:", action.error);
            });

        /* ==================== CreateMessageApi ==================== */
        builder
            .addCase(CreateMessageApi.pending, (state) => {
                state.createMessageLoading = true;
                state.createMessageError = null;
            })
            .addCase(CreateMessageApi.fulfilled, (state, action) => {
                const message = action.payload;
                const conversation = findConversation(
                    state.conversationList,
                    message.conversationId
                );

                if (conversation) {
                    conversation.messages = upsertMessages(
                        conversation.messages,
                        [message]
                    );
                    updateConversationLastMessage(conversation, message);
                }

                state.createMessageLoading = false;
                state.createMessageError = null;
            })
            .addCase(CreateMessageApi.rejected, (state, action) => {
                state.createMessageLoading = false;
                state.createMessageError = action.error.message ?? "Failed to create message";
            });

        /* ==================== conversationSeenAllMessage ==================== */
        builder
            .addCase(conversationSeenAllMessage.pending, (state) => {
                // Optional: Add loading state
            })
            .addCase(conversationSeenAllMessage.fulfilled, (state, action) => {
                const { conversationId, authorId } = action.payload;
                const conversation = findConversation(
                    state.conversationList,
                    conversationId
                );

                if (conversation) {
                    conversation.totalUnreadMessagesCount = 0;
                    updateSeenBy(conversation.messages, authorId);
                }
            })
            .addCase(conversationSeenAllMessage.rejected, (state, action) => {
                console.error("Failed to mark messages as seen:", action.error);
            });

        /* ==================== AiMessagePromptApi ==================== */
        builder
            .addCase(AiMessagePromptApi.pending, (state) => {
                state.ai_messageCreateLoading = true;
                state.ai_messageError = null;
            })
            .addCase(AiMessagePromptApi.fulfilled, (state) => {
                state.ai_messageCreateLoading = false;
                state.ai_messageError = null;
            })
            .addCase(AiMessagePromptApi.rejected, (state, action) => {
                state.ai_messageCreateLoading = false;
                state.ai_messageError = action.error.message ?? "Failed to generate AI response";
            });
    },
});

/* ==================== EXPORTS ==================== */

export const {
    setMessage,
    setMessageSeen,
    setTyping,
    setUploadImageInMessage,
    setUploadFiles,
    clearUploadFiles,
    saveMyPrompt,
    loadMyPrompt,
    completeAiMessageGenerate,
    setConversations,
    resetConversationState,
    clearAiMessageError,
    updateUnreadCount,
    removeConversation,
} = ConversationSlice.actions;

export default ConversationSlice.reducer;
