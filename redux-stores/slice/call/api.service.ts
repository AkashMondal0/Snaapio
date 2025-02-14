import { graphqlQuery } from "@/lib/GraphqlQuery";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { callQueries } from "./queries";
import { AuthorData } from "@/types";

export const sendCallingRequestApi = createAsyncThunk(
    'sendCallingRequestApi/post',
    async (requestForCallInput: {
        requestUserId: string,
        micOn: boolean,
        videoOn: boolean,
        type: string,
        requestUserData: AuthorData
    }, thunkAPI) => {
        try {
            const { requestUserData, ...Input } = requestForCallInput
            const res = await graphqlQuery({
                query: callQueries.requestForCallInput,
                variables: { requestForCallInput: Input }
            })
            return { ...res, userData: requestUserData }
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                message: "Internal Error"
            })
        }
    }
);

export const incomingCallAnswerApi = createAsyncThunk(
    'incomingCallAnswerApi/post',
    async (incomingCallAnswer: {
        requestSenderUserId: string,
        micOn: boolean,
        videoOn: boolean,
        acceptCall: boolean
    }, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: callQueries.incomingCallAnswer,
                variables: { incomingCallAnswer }
            })
            return res
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                message: "Internal Error"
            })
        }
    }
);