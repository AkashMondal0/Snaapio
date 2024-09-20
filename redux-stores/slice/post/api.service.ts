import { graphqlQuery } from "@/lib/GraphqlQuery";
import { AuthorData } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchOnePostApi = createAsyncThunk(
    'fetchOnePostApi/get',
    async (findOnePostId: string, thunkApi) => {
        // try {
        //     const data = await graphqlQuery({
        //         query: findOnePostQuery.query,
        //         variables: { findOnePostId }
        //     })

        //     return data[findOnePostQuery.name]
        // } catch (error: any) {
        //     return thunkApi.rejectWithValue({
        //         message: error?.message
        //     })
        // }
    }
);

export const createPostLikeApi = createAsyncThunk(
    'createPostLikeApi/post',
    async (createLikeId: string, thunkApi) => {
        try {
            let query = `mutation CreateLike($createLikeId: String!) {
                createLike(id: $createLikeId) {
                __typename
                }
              }`
            const res = await graphqlQuery({
                query: query,
                variables: { createLikeId }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const destroyPostLikeApi = createAsyncThunk(
    'destroyPostLikeApi/post',
    async (destroyLikeId: string, thunkApi) => {
        try {
            let query = `mutation DestroyLike($destroyLikeId: String!) {
                destroyLike(id: $destroyLikeId) {
                __typename
                }
              }`
            const res = await graphqlQuery({
                query: query,
                variables: { destroyLikeId }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

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
            let query = `mutation CreateComment($createCommentInput: CreateCommentInput!) {
                createComment(createCommentInput: $createCommentInput) {
                  updatedAt
                  postId
                  id
                  createdAt
                  content
                  authorId
                }
              }`
            const res = await graphqlQuery({
                query: query,
                variables: { createCommentInput }
            })

            return { ...res.createComment, user }
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
            let query = `query FindAllLikes($findAllLikesInput: GraphQLPageQuery!) {
                findAllLikes(findAllLikesInput: $findAllLikesInput) {
                  following
                  followed_by
                  id
                  username
                  email
                  name
                  profilePicture
                }
              }
              `
            const res = await graphqlQuery({
                query: query,
                variables: { findAllLikesInput }
            })

            return res.findAllLikes
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
            let query = `query FindAllComments($createCommentInput: GraphQLPageQuery!) {
                findAllComments(createCommentInput: $createCommentInput) {
                  id
                  content
                  authorId
                  postId
                  createdAt
                  updatedAt
                  user {
                    username
                    email
                    name
                    profilePicture
                  }
                }
              }
              `
            const res = await graphqlQuery({
                query: query,
                variables: { createCommentInput }
            })

            return res.findAllComments
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);