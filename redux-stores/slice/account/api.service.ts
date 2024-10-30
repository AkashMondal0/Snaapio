import { createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { ImageCompressorAllQuality } from "@/lib/RN-ImageCompressor";
import { Asset } from "expo-media-library";
import { Assets, findDataInput, Story } from "@/types";
import { AQ } from "./account.queries";

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
            let fileUrls: Assets[] = []
            await Promise.all(data.files.map(async (file) => {
                await new Promise((resolve) => setTimeout(resolve, 300))
                const compressedImages = await ImageCompressorAllQuality({ image: file.uri })
                if (!compressedImages) return
                fileUrls.push({
                    id: file.id,
                    urls: compressedImages,
                    type: file.mediaType === "photo" ? "photo" : "video"
                })
            }))
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
            })
            return res
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
            let fileUrls: Assets[] = []
            await Promise.all(data.files.map(async (file) => {
                await new Promise((resolve) => setTimeout(resolve, 300))
                const compressedImages = await ImageCompressorAllQuality({ image: file.uri })
                if (!compressedImages) return
                fileUrls.push({
                    id: file.id,
                    urls: compressedImages,
                    type: file.mediaType === "photo" ? "photo" : "video"
                })
            }))
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
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
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
    async (findStoryId: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.findStory,
                variables: { findStoryId }
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
    async (findStoryId: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.findStory,
                variables: { findStoryId }
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
    async (limitAndOffset: findDataInput, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: AQ.findAllStory,
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