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

    conversation: Conversation | null;
    loading: boolean;
    error: string | null;
    messages: Message[];
    messageLoading: boolean;
    messageError: string | null;

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
    ai_messageError: string | null;

    ai_messageCreateLoading: boolean;
}

// Define the initial state using that type
const ConversationState: ConversationStateType = {
    conversationList: [],
    listLoading: "idle",
    listError: null,

    conversation: null,
    loading: false,
    error: null,
    messages: [],
    messageLoading: false,
    messageError: null,

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
};

export const ConversationSlice = createSlice({
    name: "conversation",
    initialState: ConversationState,
    reducers: {
        // typing
        setTyping: (state, action: PayloadAction<Typing>) => {
            state.currentTyping = action.payload;
        },
        // messages
        setMessage: (state, action: PayloadAction<Message>) => {
            const index = state.conversationList.findIndex((i) =>
                i.id === action.payload.conversationId
            );
            if (index !== -1) {
                state.conversationList[index].messages?.push(action.payload);
                state.conversationList[index].lastMessageContent =
                    action.payload.content;
                state.conversationList[index].lastMessageCreatedAt =
                    action.payload.createdAt;
                state.conversationList[index].totalUnreadMessagesCount += 1;
            }
            if (
                state?.conversation &&
                action.payload.conversationId === state?.conversation.id
            ) {
                state.messages.unshift(action.payload);
            }
        },
        setMessageSeen: (
            state,
            action: PayloadAction<{ conversationId: string; authorId: string }>,
        ) => {
            if (action.payload.conversationId === state?.conversation?.id) {
                state.messages.forEach((message) => {
                    if (
                        message.seenBy.findIndex((i) =>
                            i === action.payload.authorId
                        ) === -1
                    ) {
                        message.seenBy.push(action.payload.authorId);
                    }
                });
            }
        },
        resetConversation: (state) => {
            state.conversation = null;
            state.messages = [];
        },
        resetConversationState: (state) => {
            state.conversationList = [];
            state.conversation = null;
            state.messages = [];
            state.currentTyping = null;
        },
        setUploadImageInMessage: (state, action: PayloadAction<Message>) => {
            const index = state.conversationList.findIndex((i) =>
                i.id === action.payload.conversationId
            );
            if (state.conversation) {
                state.messages.push(action.payload);
            }
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
        setConversation: (state, action: PayloadAction<Conversation>) => {
            state.conversation = action.payload;
            state.messages = [];
        },
        //
        setUploadFiles: (state, action: PayloadAction<Asset[] | []>) => {
            state.uploadFiles = action.payload;
        },
        // save my prompt
        saveMyPrompt: (state, action: PayloadAction<AiMessage>) => {
            state.ai_messages.unshift(action.payload);
        },
        loadMyPrompt: (state, action: PayloadAction<AiMessage[]>) => {
            state.ai_messages.push(...action.payload.reverse());
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
                state.conversationList = action.payload;
                state.listLoading = "normal";
            },
        );
        builder.addCase(fetchConversationsApi.rejected, (state, action) => {
            state.listLoading = "normal";
            state.listError = "error";
        });
        // fetchConversationApi
        builder.addCase(fetchConversationApi.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.messages = [];
        });
        builder.addCase(
            fetchConversationApi.fulfilled,
            (state, action: PayloadAction<Conversation>) => {
                state.conversation = action.payload;
                state.loading = false;
            },
        );
        builder.addCase(fetchConversationApi.rejected, (state, action) => {
            state.loading = false;
            state.error = "error";
            state.messages = [];
        });
        //fetchConversationAllMessagesApi
        builder.addCase(fetchConversationAllMessagesApi.pending, (state) => {
            state.messageLoading = true;
            state.messageError = null;
        });
        builder.addCase(
            fetchConversationAllMessagesApi.fulfilled,
            (state, action: PayloadAction<Message[]>) => {
                if (state.conversation) {
                    state.messages.push(...action.payload.reverse());
                }
                state.messageLoading = false;
            },
        );
        builder.addCase(
            fetchConversationAllMessagesApi.rejected,
            (state, action) => {
                state.messageLoading = false;
                state.messageError = "error";
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
                // tempMessageId is used to update the message in the conversation list
                if (state.conversation && action.payload.tempMessageId) {
                    const mIndex = state.conversation.messages.findIndex((i) =>
                        i.id === action.payload.tempMessageId
                    );
                    state.conversation.messages[mIndex] = action.payload;
                    if (index !== -1) {
                        state.conversationList[index].messages[mIndex] =
                            action.payload;
                        state.conversationList[index].lastMessageContent =
                            action.payload.content;
                        state.conversationList[index].lastMessageCreatedAt =
                            action.payload.createdAt;
                    }
                } else {
                    if (index !== -1) {
                        state.conversationList[index].messages?.push(
                            action.payload,
                        );
                        state.conversationList[index].lastMessageContent =
                            action.payload.content;
                        state.conversationList[index].lastMessageCreatedAt =
                            action.payload.createdAt;
                    }
                    if (state.conversation) {
                        state.messages.unshift(action.payload);
                    }
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
            (
                state,
                action: PayloadAction<
                    {
                        conversationId: string;
                        authorId: string;
                        memberLength?: number;
                    }
                >,
            ) => {
                const index = state.conversationList.findIndex((i) =>
                    i.id === action.payload.conversationId
                );
                if (index !== -1) {
                    state.conversationList[index].totalUnreadMessagesCount = 0;
                    state.conversationList[index].messages?.forEach(
                        (message) => {
                            if (
                                message.seenBy.findIndex((i) =>
                                    i === action.payload.authorId
                                ) === -1
                            ) {
                                message.seenBy.push(action.payload.authorId);
                            }
                        },
                    );
                }
                if (
                    state?.conversation &&
                    action.payload.conversationId === state?.conversation.id
                ) {
                    state.conversation?.messages?.forEach((message) => {
                        if (
                            message.seenBy.findIndex((i) =>
                                i === action.payload.authorId
                            ) === -1
                        ) {
                            message.seenBy.push(action.payload.authorId);
                        }
                    });
                }
            },
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
            state.ai_messageCreateLoading = false;
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
    resetConversation,
    setConversation,
    showUploadImageInMessage,
    setUploadImageInMessage,
    resetConversationState,
    setUploadFiles,
    saveMyPrompt,
    loadMyPrompt,
} = ConversationSlice.actions;

export default ConversationSlice.reducer;
