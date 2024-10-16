import { createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { Assets, findDataInput, Post } from "@/types";
import { AQ } from "./account.queries";
// import { currentUploadingFile } from ".";
import * as MediaLibrary from "expo-media-library";
import { ImageCompressor } from "@/lib/RN-ImageCompressor";
import { uploadFileToSupabase } from "@/lib/SupaBase-uploadFile";

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
        files: MediaLibrary.Asset[],
        caption?: string
        location?: string
        tags?: string[]
        authorId: string
    }, thunkApi) => {
        try {
            let fileUrls: Post["files"] = []
            await Promise.all(data.files.map(async (file) => {
                // thunkApi.dispatch(currentUploadingFile(file.uri))
                const compressedImage = await ImageCompressor({ image: file.uri, quality: "medium" })
                // get the file url and push it to the fileUrls array
                if (!compressedImage) return
                // upload the compressed image to the server storage and get the url
                const fileUrl = await uploadFileToSupabase(compressedImage, "image/jpeg", data.authorId);
                if (!fileUrl) return;
                fileUrls.push({ urls: [fileUrl], type: file.mediaType === "photo" ? "photo" : "video" })
            }))
            // const res = await graphqlQuery({
            //     query: AQ.feedTimelineConnection,
            //     variables: { limitAndOffset }
            // })
            // return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);