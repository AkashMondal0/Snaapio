import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loadingType, Post } from '@/types'
import { fetchAccountFeedApi, uploadFilesApi } from './api.service'
import * as MediaLibrary from 'expo-media-library';


export type AccountState = {
  //
  deviceAssets: MediaLibrary.Asset[]
  //
  uploadFile: string | null
  uploadFilesLoading: loadingType
  uploadFilesError: string | null
  //
  feeds: Post[]
  feedsLoading: loadingType
  feedsError: string | null
}


const initialState: AccountState = {
  deviceAssets: [],

  uploadFile: null,
  uploadFilesLoading: "idle",
  uploadFilesError: null,
  //
  feeds: [],
  feedsLoading: "idle",
  feedsError: null,
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
    },
    currentUploadingFile: (state, action: PayloadAction<string>) => {
      state.uploadFile = action.payload
    },
    setDeviceAssets: (state, action: PayloadAction<MediaLibrary.Asset[]>) => {
      state.deviceAssets = [...state.deviceAssets, ...action.payload]
    },
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
      .addCase(uploadFilesApi.pending, (state) => {
        state.uploadFilesLoading = "pending"
        state.uploadFilesError = null
        state.uploadFile = null
      })
      .addCase(uploadFilesApi.fulfilled, (state) => {
        state.uploadFilesLoading = "normal"
        state.uploadFile = null
      })
      .addCase(uploadFilesApi.rejected, (state, action: any) => {
        state.uploadFilesError = action.payload?.message ?? "upload error"
        state.uploadFilesLoading = "normal"
        state.uploadFile = null
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