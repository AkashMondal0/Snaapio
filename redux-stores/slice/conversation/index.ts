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

const updateSeenBy = (messages?: Message[], authorId?: string) => {
    if (!messages || !authorId) return;
    messages.forEach((message) => {
        if (!message.seenBy.includes(authorId)) {
            message.seenBy.push(authorId);
        }
    });
};

export type loadingType = "idle" | "pending" | "normal";
export type AiMessage = {
    id: string;
    data: AIApiResponse;
    createdAt: string;
    isAi: boolean;
    image: string | null;
};

interface ConversationStateType {
    conversationList: Conversation[];
    listLoading: loadingType;
    listError: string | null;

    currentTyping: Typing | null;

    createLoading: boolean;
    createError: string | null;

    createMessageLoading: boolean;
    createMessageError: string | null;

    uploadFiles: Asset[];
    uploadFilesLoading: boolean;
    uploadFilesError: string | null;

    ai_messages: AiMessage[];
    ai_messageLoading: boolean;
    ai_CurrentMessageId: string | null;
    ai_messageError: string | null;
    ai_messageCreateLoading: boolean;
}

const ConversationState: ConversationStateType = {
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

export const ConversationSlice = createSlice({
    name: "conversation",
    initialState: ConversationState,
    reducers: {
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversationList = mergeConversations(state.conversationList, action.payload);
        },
        setTyping: (state, action: PayloadAction<Typing>) => {
            state.currentTyping = action.payload;
        },
        setMessage: (state, action: PayloadAction<Message>) => {
            const conversation = state.conversationList.find(
                (c) => c.id === action.payload.conversationId
            );
            if (conversation) {
                conversation.messages = upsertMessages(conversation.messages, [action.payload]);
                conversation.lastMessageContent = action.payload.content;
                conversation.lastMessageCreatedAt = action.payload.createdAt;
                conversation.totalUnreadMessagesCount += 1;
            }
        },
        setMessageSeen: (
            state,
            action: PayloadAction<{ conversationId: string; authorId: string }>
        ) => {
            const { conversationId, authorId } = action.payload;
            const conversation = state.conversationList.find((c) => c.id === conversationId);
            if (conversation) {
                updateSeenBy(conversation.messages, authorId);
            }
        },
        setUploadImageInMessage: (state, action: PayloadAction<Message>) => {
            const conversation = state.conversationList.find(
                (c) => c.id === action.payload.conversationId
            );
            if (conversation) {
                conversation.messages = upsertMessages(conversation.messages, [action.payload]);
                conversation.lastMessageContent = action.payload.content;
                conversation.lastMessageCreatedAt = action.payload.createdAt;
            }
        },
        setUploadFiles: (state, action: PayloadAction<Asset[] | []>) => {
            state.uploadFiles = action.payload;
        },
        saveMyPrompt: (state, action: PayloadAction<AiMessage>) => {
            state.ai_messages.unshift(action.payload);
            state.ai_CurrentMessageId = action.payload.id;
            state.ai_messageCreateLoading = false;
        },
        completeAiMessageGenerate: (state) => {
            state.ai_CurrentMessageId = null;
            state.ai_messageCreateLoading = false;
        },
        loadMyPrompt: (state, action: PayloadAction<AiMessage[]>) => {
            state.ai_messages.push(...action.payload.reverse());
        },
        resetConversationState: (state) => {
            Object.assign(state, ConversationState);
        },
    },
    extraReducers: (builder) => {
        // fetchConversationsApi
        builder.addCase(fetchConversationsApi.pending, (state) => {
            state.listLoading = "pending";
            state.listError = null;
        });
        builder.addCase(fetchConversationsApi.fulfilled, (state, action) => {
            state.conversationList = mergeConversations(state.conversationList, action.payload);
            state.listLoading = "normal";
        });
        builder.addCase(fetchConversationsApi.rejected, (state) => {
            state.listLoading = "pending";
            state.listError = "error";
        });

        // fetchConversationApi
        builder.addCase(fetchConversationApi.fulfilled, (state, action) => {
            state.conversationList = mergeConversations(state.conversationList, [action.payload]);
        });

        // fetchConversationAllMessagesApi
        builder.addCase(fetchConversationAllMessagesApi.fulfilled, (state, action) => {
            if (!action.payload.length) return;
            const conversationId = action.payload[0].conversationId;
            const conversation = state.conversationList.find((c) => c.id === conversationId);
            if (conversation) {
                conversation.messages = upsertMessages(conversation.messages, action.payload);
            }
        });

        // CreateMessageApi
        builder.addCase(CreateMessageApi.pending, (state) => {
            state.createMessageLoading = true;
            state.createMessageError = null;
        });
        builder.addCase(CreateMessageApi.fulfilled, (state, action) => {
            const conversation = state.conversationList.find(
                (c) => c.id === action.payload.conversationId
            );
            if (conversation) {
                conversation.messages = upsertMessages(conversation.messages, [action.payload]);
                conversation.lastMessageContent = action.payload.content;
                conversation.lastMessageCreatedAt = action.payload.createdAt;
            }
            state.createMessageLoading = false;
        });
        builder.addCase(CreateMessageApi.rejected, (state) => {
            state.createMessageLoading = false;
            state.createMessageError = "error";
        });

        // conversationSeenAllMessage
        builder.addCase(conversationSeenAllMessage.fulfilled, (state, action) => {
            const { conversationId, authorId } = action.payload;
            const conversation = state.conversationList.find((c) => c.id === conversationId);
            if (conversation) {
                conversation.totalUnreadMessagesCount = 0;
                updateSeenBy(conversation.messages, authorId);
            }
        });

        // AiMessagePromptApi
        builder.addCase(AiMessagePromptApi.pending, (state) => {
            state.ai_messageCreateLoading = true;
            state.ai_messageError = null;
        });
        builder.addCase(AiMessagePromptApi.fulfilled, (state) => {
            state.ai_messageCreateLoading = false;
        });
        builder.addCase(AiMessagePromptApi.rejected, (state) => {
            state.ai_messageCreateLoading = false;
            state.ai_messageError = "error";
        });
    },
});

export const {
    setMessage,
    setMessageSeen,
    setTyping,
    setUploadImageInMessage,
    setUploadFiles,
    saveMyPrompt,
    loadMyPrompt,
    completeAiMessageGenerate,
    setConversations,
    resetConversationState,
} = ConversationSlice.actions;

export default ConversationSlice.reducer;
