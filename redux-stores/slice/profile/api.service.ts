import { graphqlQuery } from "@/lib/GraphqlQuery";
import { findDataInput } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { QProfile } from "./profile.queries";

export const fetchUserProfileDetailApi = createAsyncThunk(
    'fetchUserProfileDetailApi/get',
    async (username: string, thunkApi) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 400))
            const res = await graphqlQuery({
                query: QProfile.findUserProfile,
                variables: { username }
            })

            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const fetchUserProfilePostsApi = createAsyncThunk(
    'fetchUserProfilePostsApi/get',
    async (data: findDataInput, thunkApi) => {
        const { username, ...findAllPosts } = data
        findAllPosts.id = username
        try {
            const res = await graphqlQuery({
                query: QProfile.findAllPosts,
                variables: { findAllPosts }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const createFriendshipApi = async (data: {
    authorUserId: string,
    authorUsername: string,
    followingUserId: string,
    followingUsername: string
}): Promise<boolean> => {
    const { ...createFriendshipInput } = data
    try {
        await graphqlQuery({
            query: QProfile.createFriendship,
            variables: {
                createFriendshipInput
            }
        })
        return true
    } catch (error: any) {
        console.error(error)
        return false
    }
}

export const destroyFriendshipApi = async (data: {
    authorUserId: string,
    authorUsername: string,
    followingUserId: string,
    followingUsername: string
}): Promise<boolean> => {
    const { ...destroyFriendship } = data
    try {
        await graphqlQuery({
            query: QProfile.destroyFriendship,
            variables: {
                destroyFriendship
            }
        })
        return true
    } catch (error: any) {
        console.error(error)
        return false
    }
}

export const RemoveFriendshipApi = createAsyncThunk(
    'RemoveFriendshipApi/post',
    async (data: {
        authorUserId: string,
        authorUsername: string,
        followingUserId: string,
        followingUsername: string
    }, thunkApi) => {
        const { ...destroyFriendship } = data
        try {
            await graphqlQuery({
                query: QProfile.RemoveFriendshipApi,
                variables: {
                    destroyFriendship
                }
            })
            return true
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchUserProfileFollowingUserApi = createAsyncThunk(
    'fetchUserProfileFollowingUserApi/get',
    async (data: findDataInput, thunkApi) => {
        let { username, ...viewFollowingInput } = data
        viewFollowingInput.id = username
        try {
            const res = await graphqlQuery({
                query: QProfile.findAllFollowing,
                variables: { viewFollowingInput }
            })

            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchUserProfileFollowerUserApi = createAsyncThunk(
    'fetchUserProfileFollowerUserApi/get',
    async (data: findDataInput, thunkApi) => {
        let { username, ...viewFollowerInput } = data
        viewFollowerInput.id = username
        try {
            const res = await graphqlQuery({
                query: QProfile.findAllFollower,
                variables: { viewFollowerInput }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchUserHighlightApi = createAsyncThunk(
    'fetchAccountStoryApi/get',
    async (limitAndOffset: findDataInput, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QProfile.findAllHighlight,
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
