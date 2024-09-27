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
    likesLoading?: boolean
    likesError?: string | null
    likesUserList: AuthorData[]
    // comment
    comments: Comment[]
    commentsLoading: boolean
    commentsError: string | null

    createLikeLoading?: boolean
    createLikeError?: string | null

    createCommentLoading?: boolean
    createCommentError?: string | null
}

// Define the initial state using that type
const PostState: PostStateType = {
    feeds: [],
    feedsLoading: false,
    feedsError: null,

    viewPost: null,
    viewPostLoading: false,
    viewPostError: null,

    likesUserList: [],
    likesLoading: false,
    likesError: null,

    comments: [],
    commentsLoading: false,
    commentsError: null
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
                state.likesLoading = true
                state.likesUserList = []
            })
            .addCase(fetchPostLikesApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
                state.likesUserList.push(...action.payload)
                state.likesLoading = false
            })
            .addCase(fetchPostLikesApi.rejected, (state, action) => {
                state.likesLoading = false
                state.likesUserList = []
            })
            // createPostCommentApi
            .addCase(createPostCommentApi.pending, (state) => {
                // state.commentsLoading = true
            })
            .addCase(createPostCommentApi.fulfilled, (state, action: PayloadAction<Comment>) => {
                state.comments.unshift(action.payload)
                // state.commentsLoading = false
            })
            .addCase(createPostCommentApi.rejected, (state, action) => {
                // state.commentsLoading = false
            })
            //fetchPostCommentsApi
            .addCase(fetchPostCommentsApi.pending, (state) => {
                state.commentsLoading = true
            })
            .addCase(fetchPostCommentsApi.fulfilled, (state, action: PayloadAction<Comment[]>) => {
                const commentsId = action.payload.map((comment) => comment.id)
                const uniqueComments = action.payload.filter((comment, index) => commentsId.indexOf(comment.id) === index)
                state.comments = uniqueComments
                state.commentsLoading = false
            })
            .addCase(fetchPostCommentsApi.rejected, (state, action) => {
                state.commentsLoading = false
            })
    },
})

export const {
    setMorePosts,
    resetPostState,
    resetViewPost,
    setViewPost,
    resetComments,
    resetLike
} = PostsSlice.actions

export default PostsSlice.reducer