import { graphqlQuery } from "@/lib/GraphqlQuery";
import { AIApiResponse, findDataInput } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CQ } from "./conversation.queries";
import { Asset } from "expo-media-library";
import { configs } from "@/configs";
import { Session } from "@/types";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { getSecureStorage } from "@/lib/SecureStore";

export const fetchConversationsApi = createAsyncThunk(
    "fetchConversationsApi/get",
    async (graphQlPageQuery: findDataInput, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findAllConversation,
                variables: { graphQlPageQuery },
            });
            return res as any;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const fetchConversationApi = createAsyncThunk(
    "fetchConversationApi/get",
    async (id: string, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findOneConversation,
                variables: { graphQlPageQuery: { id } },
            });
            return res as any;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const fetchConversationAllMessagesApi = createAsyncThunk(
    "fetchConversationAllMessagesApi/get",
    async (graphQlPageQuery: findDataInput, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findAllMessages,
                variables: { graphQlPageQuery },
            });
            return res as any;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const CreateConversationApi = createAsyncThunk(
    "CreateConversationApi/post",
    async (memberIds: string[], thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.createConversation,
                variables: {
                    createConversationInput: {
                        isGroup: false,
                        memberIds,
                    },
                },
            });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

//  messages
export const CreateMessageApi = createAsyncThunk(
    "CreateMessageApi/post",
    async (createMessageInput: {
        content: string;
        authorId: string;
        conversationId: string;
        members: string[];
        fileUrl: Asset[];
    }, thunkAPI) => {
        try {
            const fileUrls = createMessageInput?.fileUrl?.length > 0 ? await uploadPost({ files: createMessageInput.fileUrl }) : null;
            createMessageInput.fileUrl = fileUrls as any;
            const res = await graphqlQuery({
                query: CQ.createMessage,
                variables: { createMessageInput },
            });
            return res as any;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const conversationSeenAllMessage = createAsyncThunk(
    "conversationSeenAllMessage/post",
    async (createMessageInputSeen: {
        conversationId: string;
        authorId: string;
        members: string[]
    }, thunkAPI) => {
        try {
            await graphqlQuery({
                query: CQ.seenMessages,
                variables: { createMessageInputSeen },
            });
            return {
                conversationId: createMessageInputSeen.conversationId,
                authorId: createMessageInputSeen.authorId,
                memberLength: createMessageInputSeen.members.length
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

// ai messages
export const AiMessagePromptApi = createAsyncThunk(
    "AiMessagePromptApi/post",
    async (data: {
        content: string;
        authorId: string;
        file: string | null;
        type: "text" | "image";
    }, thunkAPI) => {

        let response: Response;
        const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
        if (!BearerToken?.accessToken) {
            console.error("Error retrieving token from SecureStorage")
            ToastAndroid.showWithGravity("Internal Error", ToastAndroid.SHORT, ToastAndroid.CENTER);
            return;
        };

        try {
            if (data.type === "image") {
                response = await fetch(`${configs.serverApi.baseUrl}/ai/text-to-image/${data.authorId}`, {
                    method: "POST",
                    credentials: "include",
                    cache: 'no-cache',
                    headers: {
                        'Authorization': `${BearerToken.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "prompt": `${data.content}`,
                    }),
                });
            }
            else if (data.file && data.type === "text") {
                const formData = new FormData();
                const fileInfo = await FileSystem.getInfoAsync(data.file);

                if (!fileInfo.exists) {
                    console.error(`File not found: ${data.file}`);
                    return null;
                };

                const _file: any = {
                    uri: data.file,
                    type: "image/jpeg",
                    name: `upload_${Date.now()}.jpg`,
                };

                formData.append("file", _file as any);

                response = await fetch(`${configs.serverApi.baseUrl}/ai/gemini2/${data.authorId}?prompt=${data.content}`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Authorization': `${BearerToken.accessToken}`,
                    },
                });
            } else {
                response = await fetch(`${configs.serverApi.baseUrl}/ai/gemini2/${data.authorId}?prompt=${data.content}`, {
                    method: "POST",
                    headers: {
                        'Authorization': `${BearerToken.accessToken}`,
                    },
                });
            };

            const result = await response.json() as AIApiResponse;
            // console.log("result", result);
            if (!response.ok || !result?.type) {
                console.error("Upload failed:", result);
                return;
            };
            return result;
        } catch (error: any) {
            console.error(error);
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const uploadPost = async (data: {
    files: Asset[]
}): Promise<any | null> => {
    if (!data?.files || !Array.isArray(data.files)) {
        console.error("Invalid data.files:", data.files);
        return;
    }

    const formData = new FormData();

    const filePromises = data.files.map(async (file, index) => {
        if (!file?.uri) {
            console.error(`File at index ${index} is missing a URI:`, file);
            return null;
        }

        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        if (!fileInfo.exists) {
            console.error(`File not found: ${file.uri}`);
            return null;
        }

        return {
            uri: file.uri,
            type: file.mediaType === "photo" ? "image/jpeg" : "video/mp4",
            name: file.filename || `upload_${Date.now()}.jpg`,
        };
    });

    const files = (await Promise.all(filePromises)).filter(Boolean); // Remove `null` values

    files.forEach((file) => {
        formData.append("files", file as any); // Change to "files" if needed
    });

    try {
        const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
        if (!BearerToken?.accessToken) {
            console.error("Error retrieving token from SecureStorage")
            ToastAndroid.showWithGravity("Internal Error", ToastAndroid.SHORT, ToastAndroid.CENTER);
            return;
        };
        const response = await fetch(`${configs.serverApi.baseUrl}/image/upload_variant`, {
            method: "POST",
            body: formData,
            credentials: "include",
            cache: 'no-cache',
            headers: {
                'Authorization': `${BearerToken.accessToken}`,
            },
        });
        if (!response.ok) {
            const result = await response.json();
            console.error("Upload failed:", result);
            return null;
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

export const sendTyping = async (typingStatusInput: any) => {
    await graphqlQuery({
        query: CQ.sendTypingStatus,
        variables: { typingStatusInput },
    });
}