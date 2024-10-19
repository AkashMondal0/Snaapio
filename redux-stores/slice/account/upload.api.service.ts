import { AQ } from "./account.queries";
import * as MediaLibrary from "expo-media-library";
import { ImageCompressorAllQuality } from "@/lib/RN-ImageCompressor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Post } from "@/types";
import { currentUploadingFile } from "./";
import { graphqlQuery } from "@/lib/GraphqlQuery";

export const uploadFilesApi = createAsyncThunk(
    'uploadFilesApi/post',
    async (data: {
        files: MediaLibrary.Asset[],
        caption?: string
        location?: string
        tags?: string[]
        authorId: string
    }, thunkApi) => {
        try {
            let fileUrls: Post["fileUrl"] = []
            await Promise.all(data.files.map(async (file) => {
                thunkApi.dispatch(currentUploadingFile(file.uri))
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
        } finally {
            thunkApi.dispatch(currentUploadingFile(null))
        }
    }
);