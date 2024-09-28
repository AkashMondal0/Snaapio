/* eslint-disable @typescript-eslint/no-unused-vars */
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { AuthorData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { QPost } from "./post.queries";

export const fetchOnePostApi = createAsyncThunk(
    'fetchOnePostApi/get',
    async (findOnePostId: string, thunkApi) => {
        try {
            const data = await graphqlQuery({
                query: QPost.findOnePost,
                variables: { findOnePostId }
            })
            return data
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const createPostLikeApi = async (createLikeId: string): Promise<boolean> => {
    try {
        await graphqlQuery({
            query: QPost.createLike,
            variables: { createLikeId }
        })
        return true
    } catch (error: any) {
        return false
    }
}

export const destroyPostLikeApi = async (destroyLikeId: string): Promise<boolean> => {
    try {
        await graphqlQuery({
            query: QPost.destroyLike,
            variables: { destroyLikeId }
        })
        return true
    } catch (error: any) {
        return false
    }
}

export const createPostCommentApi = createAsyncThunk(
    'createPostCommentApi/post',
    async (data: {
        postId: string,
        user: AuthorData,
        content: string,
        authorId: string
    }, thunkApi) => {
        const { user, ...createCommentInput } = data
        try {
            const res = await graphqlQuery({
                query: QPost.createComment,
                variables: { createCommentInput }
            })
            return { ...res, user }
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchPostLikesApi = createAsyncThunk(
    'fetchPostLikesApi/get',
    async (findAllLikesInput: {
        offset: number,
        limit: number,
        id: string
    }, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QPost.findAllLikes,
                variables: { findAllLikesInput }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchPostCommentsApi = createAsyncThunk(
    'fetchPostCommentsApi/get',
    async (createCommentInput: {
        offset: number,
        limit: number,
        id: string
    }, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QPost.findAllComments,
                variables: { createCommentInput }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);