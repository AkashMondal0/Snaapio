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
  uploadFilesLoading: boolean
  uploadFilesError: string | null
  //
  feeds: Post[]
  feedsLoading: loadingType
  feedsError: string | null
}


const initialState: AccountState = {
  deviceAssets: [],

  uploadFile: null,
  uploadFilesLoading: false,
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
  },
})

export const {
  resetAccountState,
  resetFeeds,
  currentUploadingFile,
  setDeviceAssets
} = AccountSlice.actions

export default AccountSlice.reducer