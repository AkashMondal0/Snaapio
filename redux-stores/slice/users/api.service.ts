import { graphqlQuery } from "@/lib/GraphqlQuery";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { QUsers } from "./users.queries";
import { getCurrentLocation } from "@/lib/location";


export const searchUsersProfileApi = createAsyncThunk(
    'searchUsersProfileApi/get',
    async (id: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QUsers.findUsersByKeyword,
                variables: {
                    graphQlPageQuery: {
                        limit: 20,
                        offset: 0,
                        id: id
                    }
                }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const discoverUsersProfileApi = createAsyncThunk(
    'discoverUsersProfileApi/get',
    async (data: any, thunkApi) => {
        try {

            const location = await getCurrentLocation();
            const res = await graphqlQuery({
                query: QUsers.findNearestUsers,
                variables: {
                    graphQlPageQuery: {
                        limit: 20,
                        offset: 0,
                        distance: 20,
                        latitude: location.lat,
                        longitude: location.lon
                    }
                }
            });
            return res;
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);