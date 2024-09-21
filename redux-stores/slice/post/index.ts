import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AuthorData, Comment, Post } from '@/types'
import { createPostCommentApi, fetchOnePostApi, fetchPostCommentsApi, fetchPostLikesApi } from './api.service'

export type TypeActionLike = 'feeds' | 'singleFeed'
// Define a type for the slice state
export interface PostStateType {
    feeds: Post[]
    feedsLoading: boolean
    feedsError: string | null
    // 
    viewPost: Post | null
    viewPostLoading: boolean
    viewPostError: string | null
    // like
    likeLoading?: boolean
    likesUserList: AuthorData[]
    // comment
    commentLoading: boolean
    fetchPostCommentsLoading: boolean
}

// Define the initial state using that type
const PostState: PostStateType = {
    feeds: [],
    feedsLoading: false,
    feedsError: null,

    viewPost: null,
    viewPostLoading: false,
    viewPostError: null,

    likeLoading: false,
    likesUserList: [],

    commentLoading: false,
    fetchPostCommentsLoading: false
}

export const PostsSlice = createSlice({
    name: 'PostFeed',
    initialState: PostState,
    reducers: {
        setMorePosts: (state, action: PayloadAction<Post[]>) => {
            if (action.payload?.length > 0) {
                state.feeds.push(...action.payload)
            }
        },
        resetPostState: (state) => {
            state.feeds = []
            state.viewPost = null
            state.likesUserList = []
        }
    },
    extraReducers: (builder) => {
        builder
            // view post
            .addCase(fetchOnePostApi.pending, (state) => {
                state.viewPostLoading = true
                state.viewPostError = null
                state.viewPost = null
            })
            .addCase(fetchOnePostApi.fulfilled, (state, action: PayloadAction<Post>) => {
                state.viewPost = action.payload
                state.viewPostLoading = false
                state.viewPostError = null
            })
            .addCase(fetchOnePostApi.rejected, (state, action) => {
                state.viewPostLoading = false
                state.viewPost = null
                state.viewPostError = action.error.message || 'Failed to fetch post'
            })
            .addCase(fetchPostLikesApi.pending, (state) => {
                state.likeLoading = true
                state.likesUserList = []
            })
            .addCase(fetchPostLikesApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
                state.likesUserList = [...action.payload]
                state.likeLoading = false
            })
            .addCase(fetchPostLikesApi.rejected, (state, action) => {
                state.likeLoading = false
                state.likesUserList = []
            })
            // createPostCommentApi
            .addCase(createPostCommentApi.pending, (state) => {
                state.commentLoading = true
            })
            .addCase(createPostCommentApi.fulfilled, (state, action: PayloadAction<Comment>) => {
                // console.info(action.payload)
                state.viewPost?.comments.unshift(action.payload)
                state.commentLoading = false
            })
            .addCase(createPostCommentApi.rejected, (state, action) => {
                state.commentLoading = false
            })
            //fetchPostCommentsApi
            .addCase(fetchPostCommentsApi.pending, (state) => {
                state.fetchPostCommentsLoading = true
            })
            .addCase(fetchPostCommentsApi.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                if (state?.viewPost) {
                    state.viewPost.comments = [...action.payload]
                }
                state.fetchPostCommentsLoading = false
            })
            .addCase(fetchPostCommentsApi.rejected, (state, action) => {
                state.fetchPostCommentsLoading = false
            })
    },
})

export const {
    setMorePosts,
    resetPostState
} = PostsSlice.actions

export default PostsSlice.reducer