import { createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { Asset } from "expo-media-library";
import { findDataInput, Session, Story } from "@/types";
import { AQ } from "./account.queries";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { configs } from "@/configs";
import { getSecureStorage } from "@/lib/SecureStore";

export const fetchAccountFeedApi = createAsyncThunk(
    'fetchAccountFeedApi/get',
    async (limitAndOffset: findDataInput, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.feedTimelineConnection,
                variables: { limitAndOffset }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
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
export const uploadOneFile = async (data: {
    filesUrl: string
}): Promise<any | null> => {
    if (!data?.filesUrl || !Array.isArray(data.filesUrl)) {
        console.error("Invalid data.files:", data.filesUrl);
        return;
    }

    const formData = new FormData();

    const fileInfo = await FileSystem.getInfoAsync(data?.filesUrl);
    if (!fileInfo.exists) {
        console.error(`File not found: ${data?.filesUrl}`);
        return null;
    }

    formData.append("files", {
        uri: data?.filesUrl,
        type: "image/jpeg",
        name: `avatar_${Date.now()}.jpg`,
    } as any); // Change to "files" if needed

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

export const uploadFilesApi = createAsyncThunk(
    'uploadFilesApi/post',
    async (data: {
        files: Asset[],
        caption?: string
        location?: string
        tags?: string[]
        authorId: string
    }, thunkApi) => {
        try {
            const fileUrls = await uploadPost({ files: data.files });
            if (!fileUrls) {
                return thunkApi.rejectWithValue({
                    message: "Server Error"
                });
            }
            const res = await graphqlQuery({
                query: AQ.createPost,
                variables: {
                    createPostInput: {
                        status: "published",
                        fileUrl: fileUrls,
                        content: data.caption,
                        authorId: data.authorId,
                    }
                }
            });
            return res;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const uploadStoryApi = createAsyncThunk(
    'uploadStoryApi/post',
    async (data: {
        files: Asset[]
        content?: string
        authorId: string
        song?: any[]
    }, thunkApi) => {
        try {
            const fileUrls = await uploadPost({ files: data.files });
            const res = await graphqlQuery({
                query: AQ.createStory,
                variables: {
                    createStoryInput: {
                        status: "published",
                        fileUrl: fileUrls,
                        content: data.content,
                        authorId: data.authorId,
                    }
                }
            });
            return res;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            });
        }
    }
);

export const fetchAccountStoryTimelineApi = createAsyncThunk(
    'fetchAccountStoryTimelineApi/get',
    async (limitAndOffset: findDataInput, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.storyTimelineConnection,
                variables: { limitAndOffset }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const fetchStoryApi = createAsyncThunk(
    'fetchStoryApi/get',
    async (id: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.findStory,
                variables: { graphQlPageQuery: { id } }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const fetchAccountStoryApi = createAsyncThunk(
    'fetchAccountStoryApi/get',
    async (id: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.findStory,
                variables: { graphQlPageQuery: { id } }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const fetchAccountAllStroyApi = createAsyncThunk(
    'fetchAccountAllStroyApi/get',
    async (data: findDataInput, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.findAllStory,
                variables: {
                    graphQlPageQuery: {
                        limit: data.limit,
                        offset: data.offset,
                    },
                }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const uploadHighlightApi = createAsyncThunk(
    'uploadHighlightApi/post',
    async (createHighlightInput: {
        stories: Story[]
        content?: string
        authorId: string
        status: string
        coverImageIndex: number
    }, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.createHighlight,
                variables: {
                    createHighlightInput
                }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);