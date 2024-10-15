import { createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { Assets, findDataInput } from "@/types";
import { AQ } from "./account.queries";
import { currentUploadingFile } from "./";
import * as MediaLibrary from "expo-media-library";
import { ImageCompressorAllQuality } from "@/lib/RN-ImageCompressor";

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
    }, thunkApi) => {
        try {
            let fileUrls: Assets["urls"][] = []
            await Promise.all(data.files.map(async (file) => {
                thunkApi.dispatch(currentUploadingFile(file.uri))
                const fileUrl = await ImageCompressorAllQuality({ image: file.uri })
                // get the file url and push it to the fileUrls array
                if (!fileUrl) return
                fileUrls.push(fileUrl)
            }))
            console.log(fileUrls)
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