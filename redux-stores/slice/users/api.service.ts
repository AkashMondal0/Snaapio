import { graphqlQuery } from "@/lib/GraphqlQuery";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { QUsers } from "./users.queries";


export const searchUsersProfileApi = createAsyncThunk(
    'searchUsersProfileApi/get',
    async (id: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QUsers.findUsersByKeyword,
                variables: { graphQLPageQuery: { id } }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);