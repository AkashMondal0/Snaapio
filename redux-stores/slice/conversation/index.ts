import {
    AiMessagePromptApi,
    conversationSeenAllMessage,
    CreateMessageApi,
    fetchConversationAllMessagesApi,
    fetchConversationApi,
    fetchConversationsApi,
} from "./api.service";
import { Conversation, Message, Typing } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "expo-media-library";
import { mergeConversations } from "./merge";

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
    content: string;
    createdAt: string;
    isAi: boolean;
    image: string | null;
};
// Define a type for the slice state
interface ConversationStateType {
    conversationList: Conversation[];
    listLoading: loadingType;
    listError: string | null;

    currentTyping: Typing | null;

    createLoading: boolean;
    createError: string | null;

    createMessageLoading: boolean;
    createMessageError: string | null;

    // sending image in message
    uploadFiles: Asset[];
    uploadFilesLoading: boolean;
    uploadFilesError: string | null;

    // ai
    ai_messages: AiMessage[];
    ai_messageLoading: boolean;
    ai_CurrentMessageId: string | null;
    ai_messageError: string | null;

    ai_messageCreateLoading: boolean;
}

// Define the initial state using that type
const ConversationState: ConversationStateType = {
    conversationList: [],
    listLoading: "idle",
    listError: null,

    currentTyping: null,

    createLoading: false,
    createError: null,

    createMessageLoading: false,
    createMessageError: null,

    // sending assets in message
    uploadFiles: [],
    uploadFilesLoading: false,
    uploadFilesError: null,

    ai_messages: [],
    ai_messageLoading: false,
    ai_messageError: null,
    ai_messageCreateLoading: false,
    ai_CurrentMessageId: null
};

export const ConversationSlice = createSlice({
    name: "conversation",
    initialState: ConversationState,
    reducers: {
        // conversations
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversationList = mergeConversations(state.conversationList, action.payload)
        },
        // typing
        setTyping: (state, action: PayloadAction<Typing>) => {
            state.currentTyping = action.payload;
        },
        setMessage: (state, action: PayloadAction<Message>) => {
            const index = state.conversationList.findIndex((i) =>
                i.id === action.payload.conversationId
            );
            if (index !== -1) {
                state.conversationList[index].messages?.unshift(action.payload);
                state.conversationList[index].lastMessageContent =
                    action.payload.content;
                state.conversationList[index].lastMessageCreatedAt =
                    action.payload.createdAt;
                state.conversationList[index].totalUnreadMessagesCount += 1;
            }
        },
        setMessageSeen: (
            state,
            action: PayloadAction<{ conversationId: string; authorId: string }>,
        ) => {
            const { conversationId, authorId } = action.payload;
            const conversation = state.conversationList.find((c) => c.id === conversationId);
            if (conversation) {
                updateSeenBy(conversation.messages, authorId);
            }
        },
        setUploadImageInMessage: (state, action: PayloadAction<Message>) => {
            const index = state.conversationList.findIndex((i) =>
                i.id === action.payload.conversationId
            );
            if (index !== -1) {
                state.conversationList[index].messages?.push(action.payload);
                state.conversationList[index].lastMessageContent =
                    action.payload.content;
                state.conversationList[index].lastMessageCreatedAt =
                    action.payload.createdAt;
            }
        },
        showUploadImageInMessage: (
            state,
            action: PayloadAction<{
                currentUploadImgLength?: number | null;
                error?: string;
            }>,
        ) => {
        },
        //
        setUploadFiles: (state, action: PayloadAction<Asset[] | []>) => {
            state.uploadFiles = action.payload;
        },
        // save my prompt
        saveMyPrompt: (state, action: PayloadAction<AiMessage>) => {
            state.ai_messages.unshift(action.payload);
            state.ai_CurrentMessageId = action.payload.id;
        },
        completeAiMessageGenerate: (state) => {
            state.ai_CurrentMessageId = null
            state.ai_messageCreateLoading = false
        },
        loadMyPrompt: (state, action: PayloadAction<AiMessage[]>) => {
            state.ai_messages.push(...action.payload.reverse());
        },
        resetConversationState: (state) => {
            state.conversationList = []
            state.createLoading = false;
            state.createError = null;
            state.createMessageLoading = false;
            state.createMessageError = null;
            state.uploadFiles = [];
            state.uploadFilesLoading = false;
            state.uploadFilesError = null;
            state.ai_messages = [];
            state.ai_messageLoading = false;
            state.ai_messageError = null;
            state.ai_messageCreateLoading = false;
            state.ai_CurrentMessageId = null;
        },
    },
    extraReducers: (builder) => {
        // fetchConversationsApi
        builder.addCase(fetchConversationsApi.pending, (state) => {
            state.listLoading = "pending";
            state.listError = null;
        });
        builder.addCase(
            fetchConversationsApi.fulfilled,
            (state, action: PayloadAction<Conversation[]>) => {
                state.conversationList = mergeConversations(state.conversationList, action.payload)
                state.listLoading = "normal";
            },
        );
        builder.addCase(fetchConversationsApi.rejected, (state, action) => {
            state.listLoading = "pending";
            state.listError = "error";
        });
        // fetchConversationApi
        builder.addCase(fetchConversationApi.pending, (state) => {

        });
        builder.addCase(
            fetchConversationApi.fulfilled,
            (state, action: PayloadAction<Conversation>) => {
                state.conversationList = [...state.conversationList, action.payload]
            },
        );
        builder.addCase(fetchConversationApi.rejected, (state, action) => {

        });
        fetchConversationAllMessagesApi
        builder.addCase(fetchConversationAllMessagesApi.pending, (state) => {

        });
        builder.addCase(
            fetchConversationAllMessagesApi.fulfilled,
            (state, action: PayloadAction<Message[]>) => {
                if (action.payload.length === 0) {
                    return;
                }

                const conversationId = action.payload[0].conversationId;
                const findIndex = state.conversationList.findIndex((item) => item.id === conversationId);

                if (findIndex !== -1) {
                    const existingMessages = state.conversationList[findIndex].messages;
                    const newMessages = action.payload.filter((message) => {
                        const existingMessage = existingMessages.find((m) => m.id === message.id);
                        return !existingMessage;
                    });

                    state.conversationList[findIndex].messages.push(...newMessages);
                    // @ts-ignore
                    state.conversationList[findIndex].messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
            },
        );
        builder.addCase(
            fetchConversationAllMessagesApi.rejected,
            (state, action) => {

            },
        );
        // CreateMessageApi
        builder.addCase(CreateMessageApi.pending, (state) => {
            state.createMessageLoading = true;
            state.createMessageError = null;
        });
        builder.addCase(
            CreateMessageApi.fulfilled,
            (state, action: PayloadAction<Message>) => {
                const index = state.conversationList.findIndex((i) =>
                    i.id === action.payload.conversationId
                );
                if (index !== -1) {
                    state.conversationList[index].messages?.unshift(
                        action.payload,
                    );
                    state.conversationList[index].lastMessageContent =
                        action.payload.content;
                    state.conversationList[index].lastMessageCreatedAt =
                        action.payload.createdAt;
                }
            },
        );
        builder.addCase(CreateMessageApi.rejected, (state, action) => {
            state.createMessageLoading = false;
            state.createMessageError = "error";
        });
        // conversationSeenAllMessage
        builder.addCase(conversationSeenAllMessage.pending, (state) => {
        });
        builder.addCase(
            conversationSeenAllMessage.fulfilled,
            (state, action: PayloadAction<{ conversationId: string; authorId: string; memberLength?: number }>) => {
                const { conversationId, authorId } = action.payload;
                const conversation = state.conversationList.find((c) => c.id === conversationId);
                if (conversation) {
                    conversation.totalUnreadMessagesCount = 0;
                    updateSeenBy(conversation.messages, authorId);
                }
            }
        );
        builder.addCase(
            conversationSeenAllMessage.rejected,
            (state, action) => {
            },
        );
        // AiMessagePromptApi
        builder.addCase(AiMessagePromptApi.pending, (state) => {
            state.ai_messageCreateLoading = true;
            state.ai_messageError = null;
        });
        builder.addCase(AiMessagePromptApi.fulfilled, (state) => {
            // state.ai_messageCreateLoading = false;
        });
        builder.addCase(AiMessagePromptApi.rejected, (state, action) => {
            state.ai_messageCreateLoading = false;
            state.ai_messageError = "error";
        });
    },
});

export const {
    setMessage,
    setMessageSeen,
    setTyping,
    showUploadImageInMessage,
    setUploadImageInMessage,
    setUploadFiles,
    saveMyPrompt,
    loadMyPrompt,
    completeAiMessageGenerate,
    setConversations,
    resetConversationState
} = ConversationSlice.actions;

export default ConversationSlice.reducer;
