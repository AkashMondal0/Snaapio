import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AuthorData, loadingType, Post } from '@/types'
import { fetchAccountFeedApi, fetchAccountStoryApi, uploadFilesApi, uploadStoryApi } from './api.service'
import * as MediaLibrary from 'expo-media-library';


export type AccountState = {
  //
  deviceAssets: MediaLibrary.Asset[]
  //
  uploadFile: string | null
  uploadFilesLoading: boolean
  uploadFilesError: string | null
  // 
  uploadStoryLoading: boolean
  uploadStoryError: string | null
  //
  feeds: Post[]
  feedsLoading: loadingType
  feedsError: string | null
  // 
  storyAvatars: AuthorData[]
  storyAvatarsLoading: loadingType
  storyAvatarsError: string | null
}


const initialState: AccountState = {
  deviceAssets: [],

  uploadFile: null,
  uploadFilesLoading: false,
  uploadFilesError: null,
  //
  uploadStoryLoading: false,
  uploadStoryError: null,
  //
  feeds: [],
  feedsLoading: "idle",
  feedsError: null,
  // 
  storyAvatars: [],
  storyAvatarsLoading: "idle",
  storyAvatarsError: null
}

export const AccountSlice = createSlice({
  name: 'Account',
  initialState,
  reducers: {
    resetAccountState: (state) => {
      state.feeds = []
    },
    resetFeeds: (state) => {
      state.feeds = []
      state.feedsLoading = "idle"
      state.feedsError = null
      // 
      // state.storyAvatars = []
      // state.storyAvatarsLoading = "idle"
      // state.storyAvatarsError = null
    },
    setDeviceAssets: (state, action: PayloadAction<MediaLibrary.Asset[]>) => {
      state.deviceAssets = [...state.deviceAssets, ...action.payload]
    },
    currentUploadingFile: (state, action: PayloadAction<string | null>) => {
      state.uploadFile = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountFeedApi.pending, (state) => {
        state.feedsLoading = "pending"
        state.feedsError = null
      })
      .addCase(fetchAccountFeedApi.fulfilled, (state, action: PayloadAction<Post[]>) => {
        if (action.payload?.length > 0) {
          state.feeds.push(...action.payload)
        }
        state.feedsLoading = "normal"
      })
      .addCase(fetchAccountFeedApi.rejected, (state, action: PayloadAction<any>) => {
        state.feedsLoading = "normal"
        state.feedsError = action.payload?.message ?? "fetch error"
      })
      // uploadFilesApi
      .addCase(uploadFilesApi.pending, (state) => {
        state.uploadFilesLoading = true
        state.uploadFilesError = null
      })
      .addCase(uploadFilesApi.fulfilled, (state) => {
        state.uploadFilesLoading = false
      })
      .addCase(uploadFilesApi.rejected, (state, action: any) => {
        state.uploadFilesError = action.payload?.message ?? "upload error"
        state.uploadFilesLoading = false
      })
      // uploadStoryApi
      .addCase(uploadStoryApi.pending, (state) => {
        state.uploadStoryLoading = true
        state.uploadStoryError = null
      })
      .addCase(uploadStoryApi.fulfilled, (state) => {
        state.uploadStoryLoading = false
      })
      .addCase(uploadStoryApi.rejected, (state, action: any) => {
        state.uploadStoryError = action.payload?.message ?? "upload error"
        state.uploadStoryLoading = false
      })
      // fetchAccountStoryApi
      .addCase(fetchAccountStoryApi.pending, (state) => {
        state.storyAvatarsLoading = "pending"
        state.storyAvatarsError = null
      })
      .addCase(fetchAccountStoryApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
        if (action.payload?.length > 0) {
          state.storyAvatars.push(...action.payload)
        }
        state.storyAvatarsLoading = "normal"
      })
      .addCase(fetchAccountStoryApi.rejected, (state, action: PayloadAction<any>) => {
        state.storyAvatarsLoading = "normal"
        state.storyAvatarsError = action.payload?.message ?? "fetch error"
      })
  },
})

export const {
  resetAccountState,
  resetFeeds,
  currentUploadingFile,
  setDeviceAssets
} = AccountSlice.actions

export default AccountSlice.reducer