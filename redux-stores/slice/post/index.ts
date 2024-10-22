import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AuthorData, Comment, Post } from '@/types'
import {
    createPostCommentApi,
    //  fetchOnePostApi, 
    fetchPostCommentsApi,
    fetchPostLikesApi
} from './api.service'

export type TypeActionLike = 'feeds' | 'singleFeed'
export type loadingType = 'idle' | 'pending' | 'normal'
// Define a type for the slice state
export interface PostStateType {
    viewPost: Post | null
    viewPostLoading: loadingType
    viewPostError: string | null
    // like
    likesUserList: AuthorData[]
    likesLoading?: loadingType
    likesError?: string | null
    // comment
    comments: Comment[]
    commentsLoading: loadingType
    commentsError: string | null

    createLikeLoading?: boolean
    createLikeError?: string | null

    createCommentLoading?: boolean
    createCommentError?: string | null
}

// Define the initial state using that type
const PostState: PostStateType = {

    viewPost: null,
    viewPostLoading: 'idle',
    viewPostError: null,

    likesUserList: [],
    likesLoading: 'idle',
    likesError: null,

    comments: [],
    commentsLoading: 'idle',
    commentsError: null
}

export const PostsSlice = createSlice({
    name: 'PostFeed',
    initialState: PostState,
    reducers: {
        resetPostState: (state) => {
            state.viewPost = null
            state.likesUserList = []
            state.comments = []
        },
        resetViewPost: (state) => {
            state.viewPost = null
        },
        resetComments: (state) => {
            state.comments = []
        },
        setViewPost: (state, action: PayloadAction<Post>) => {
            state.viewPost = action.payload
        },
        resetLike: (state) => {
            state.likesUserList = []
        }
    },
    extraReducers: (builder) => {
        builder
            // view post
            // .addCase(fetchOnePostApi.pending, (state) => {
            //     state.viewPostLoading = "pending"
            //     state.viewPostError = null
            //     state.viewPost = null
            // })
            // .addCase(fetchOnePostApi.fulfilled, (state, action: PayloadAction<Post>) => {
            //     state.viewPost = action.payload
            //     state.viewPostLoading = "normal"
            //     state.viewPostError = null
            // })
            // .addCase(fetchOnePostApi.rejected, (state, action) => {
            //     state.viewPostLoading = "normal"
            //     state.viewPost = null
            //     state.viewPostError = action.error.message || 'Failed to fetch post'
            // })
            // fetchPostLikesApi
            .addCase(fetchPostLikesApi.pending, (state) => {
                state.likesLoading = "pending"
                state.likesUserList = []
            })
            .addCase(fetchPostLikesApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
                state.likesUserList.push(...action.payload)
                state.likesLoading = "normal"
            })
            .addCase(fetchPostLikesApi.rejected, (state, action) => {
                state.likesLoading = "normal"
                state.likesUserList = []
            })
            // createPostCommentApi
            .addCase(createPostCommentApi.pending, (state) => {
                state.createCommentLoading = true
            })
            .addCase(createPostCommentApi.fulfilled, (state, action: PayloadAction<Comment>) => {
                state.comments.unshift(action.payload)
                state.createCommentLoading = false
            })
            .addCase(createPostCommentApi.rejected, (state, action) => {
                state.createCommentLoading = false
            })
            //fetchPostCommentsApi
            .addCase(fetchPostCommentsApi.pending, (state) => {
                state.commentsLoading = "pending"
            })
            .addCase(fetchPostCommentsApi.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                const commentsId = action.payload.map((comment) => comment.id)
                const uniqueComments = action.payload.filter((comment, index) => commentsId.indexOf(comment.id) === index)
                state.comments = uniqueComments
                state.commentsLoading = "normal"
            })
            .addCase(fetchPostCommentsApi.rejected, (state, action) => {
                state.commentsLoading = "normal"
            })
    },
})

export const {
    setViewPost,
    resetPostState,
    resetViewPost,

    resetComments,
    resetLike
} = PostsSlice.actions

export default PostsSlice.reducer