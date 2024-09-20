import { graphqlQuery } from "@/lib/GraphqlQuery";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const searchUsersProfileApi = createAsyncThunk(
    'searchUsersProfileApi/get',
    async (keyword: string, thunkApi) => {
        try {
            let query = `query FindUsersByKeyword($keyword: String!) {
                findUsersByKeyword(keyword: $keyword) {
                  username
                  profilePicture
                  name
                  id
                  email
                }
              }`
            const res = await graphqlQuery({
                query: query,
                variables: { keyword }
            })

            return res.findUsersByKeyword
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);