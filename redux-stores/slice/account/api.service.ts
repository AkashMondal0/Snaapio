import { createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { Asset } from "expo-media-library";
import { findDataInput, Story } from "@/types";
import { AQ } from "./account.queries";
import { uploadPost } from "@/lib/uploadFiles";


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