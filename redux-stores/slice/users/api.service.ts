import { graphqlQuery } from "@/lib/GraphqlQuery";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { QUsers } from "./users.queries";


export const searchUsersProfileApi = createAsyncThunk(
    'searchUsersProfileApi/get',
    async (keyword: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QUsers.findUsersByKeyword,
                variables: { keyword }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);