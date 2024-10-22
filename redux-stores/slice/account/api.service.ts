import { createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { findDataInput, Post } from "@/types";
import { AQ } from "./account.queries";
import { ImageCompressorAllQuality } from "@/lib/RN-ImageCompressor";
import { Asset } from "expo-media-library";

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
            let fileUrls: Post["fileUrl"] = []
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