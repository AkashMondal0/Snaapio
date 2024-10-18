import { createAsyncThunk } from "@reduxjs/toolkit";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { findDataInput } from "@/types";
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