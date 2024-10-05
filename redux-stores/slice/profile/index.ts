import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AuthorData, loadingType, Post, User } from '@/types'
// import { fetchUserProfileDetailApi, fetchUserProfileFollowerUserApi, fetchUserProfileFollowingUserApi, fetchUserProfilePostsApi } from './api.service'

// Define a type for the slice state
interface ProfileState {
    state: User | null
    loading: boolean
    error: string | null

    posts: Post[]
    postLoading: boolean
    postError: string | null

    friendShipLoading: boolean
    friendShipError: string | null

    followerList: AuthorData[]
    followerListLoading: loadingType
    followerListError: string | null

    followingList: AuthorData[]
    followingListLoading: loadingType
    followingListError: string | null
}

// Define the initial state using that type
const profileState: ProfileState = {
    state: null,
    loading: false,
    error: null,

    posts: [],
    postLoading: false,
    postError: null,

    friendShipLoading: false,
    friendShipError: null,

    followerList: [],
    followerListLoading: "idle",
    followerListError: null,

    followingList: [],
    followingListLoading: "idle",
    followingListError: null,
}

export const profileSlice = createSlice({
    name: 'Profile',
    initialState: profileState,
    reducers: {
        followUser: (state, action: PayloadAction) => {
            if (state.state) {
                state.state.friendship = {
                    ...state.state.friendship,
                    following: true,
                }
                state.state.followerCount += 1
            }
        },
        unFollowUser: (state, action: PayloadAction) => {
            if (state.state) {
                state.state.friendship = {
                    ...state.state.friendship,
                    following: false,
                }
                state.state.followerCount -= 1
            }
        },
        setLoadMoreProfilePosts: (state, action: PayloadAction<Post[]>) => {
            if (!state.posts) return
            state.posts.push(...action.payload)
        },
        resetProfileState: (state) => {
            state.state = null
            state.posts = []
            state.followerList = []
            state.followingList = []
        },
        resetProfileFollowList: (state) => {
            state.followerList = []
        },
        resetProfileFollowing: (state) => {
            state.followingList = []
        }
    },
    extraReducers: (builder) => {
        builder
            // find user profile
            // .addCase(fetchUserProfileDetailApi.pending, (state) => {
            //     state.loading = true
            //     state.error = null
            //     state.state = null
            //     state.postLoading = true
            //     state.posts = []
            // })
            // .addCase(fetchUserProfileDetailApi.fulfilled, (state, action: PayloadAction<User>) => {
            //     state.posts = []
            //     state.state = action.payload
            //     state.loading = false
            //     state.error = null
            // })
            // .addCase(fetchUserProfileDetailApi.rejected, (state, action: PayloadAction<any>) => {
            //     state.loading = false
            //     state.error = action.payload?.message || "Something went wrong!"
            //     state.state = null
            // })
            // find user profile posts
            // .addCase(fetchUserProfilePostsApi.pending, (state) => {
            //     state.postLoading = true
            //     state.postError = null
            // })
            // .addCase(fetchUserProfilePostsApi.fulfilled, (state, action: PayloadAction<Post[]>) => {
            //     state.posts.push(...action.payload)
            //     state.postLoading = false
            // })
            // .addCase(fetchUserProfilePostsApi.rejected, (state, action) => {
            //     state.postLoading = false
            //     state.postError = action.error.message || null
            // })
            // find user profile following list
            // .addCase(fetchUserProfileFollowingUserApi.pending, (state) => {
            //     state.followingListLoading = "pending"
            //     state.followingListError = null
            // })
            // .addCase(fetchUserProfileFollowingUserApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
            //     state.followingList = action.payload
            //     state.followingListLoading = "normal"
            // })
            // .addCase(fetchUserProfileFollowingUserApi.rejected, (state, action) => {
            //     state.followingListLoading = "normal"
            //     state.followingListError = action.error.message || null
            // })
            // find user profile follower list
            // .addCase(fetchUserProfileFollowerUserApi.pending, (state) => {
            //     state.followerListLoading = "pending"
            //     state.followerListError = null
            // })
            // .addCase(fetchUserProfileFollowerUserApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
            //     state.followerList = action.payload
            //     state.followerListLoading = "normal"
            // })
            // .addCase(fetchUserProfileFollowerUserApi.rejected, (state, action) => {
            //     state.followerListLoading = "normal"
            //     state.followerListError = action.error.message || null
            // })
    },
})

export const {
    followUser,
    unFollowUser,
    setLoadMoreProfilePosts,
    resetProfileState,
    resetProfileFollowList,
    resetProfileFollowing
} = profileSlice.actions

export default profileSlice.reducer