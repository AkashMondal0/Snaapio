import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Post } from '@/types'
import { fetchAccountFeedApi } from './api.service'


export type AccountState = {
  // uploadFiles: {
  //   loading: "idle" | "pending" | "fulfilled" | "rejected",
  //   currentUploadImg: string | null,
  //   error: string | null
  // },
  feeds: Post[]
  feedsLoading: "idle" | "pending" | "normal"
  feedsError: string | null
}


const initialState: AccountState = {
  // uploadFiles: {
  //   loading: false,
  //   currentUploadImg: null,
  //   error: null
  // },
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
    //   .addCase(UploadImagesFireBaseApi.pending, (state) => {
    //     state.UploadFiles.loading = true
    //     state.UploadFiles.error = null
    //     state.UploadFiles.currentUploadImg = null
    //   })
    //   .addCase(UploadImagesFireBaseApi.fulfilled, (state) => {
    //     state.UploadFiles.loading = false
    //     state.UploadFiles.error = null
    //     state.UploadFiles.currentUploadImg = null
    //   })
    //   .addCase(UploadImagesFireBaseApi.rejected, (state, action) => {
    //     state.UploadFiles.loading = false
    //     state.UploadFiles.error = action.payload
    //   })
  },
})

export const {
  resetAccountState,
  resetFeeds
} = AccountSlice.actions

export default AccountSlice.reducer