import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Status } from '../../../types/profile'
import axios from 'axios';
import { localhost } from '../../../keys';
import { skyUploadImage, skyUploadVideo } from '../../../utils/upload-file';

// export const getFriendStatuses = createAsyncThunk(
//   'getFriendStatuses/fetch',
//   async (data: {
//     profileId: string,
//     friendIds: string[],
//   }, thunkApi) => {
//     try {

//       const response = await axios.post(`${localhost}/status/get`, {
//         _ids: [...data.friendIds, data.profileId],
//         profileId: data.profileId
//       })

//       const myStatus = response.data?.find((item: Status_) => item.userId === data.profileId)
//       const friendStatus = response.data?.filter((item: any) => item.userId !== data.profileId)
//       return {
//         friendStatus: friendStatus || [],
//         myStatus: myStatus || null
//       };
//     } catch (error: any) {
//       return thunkApi.rejectWithValue(error.response.data)
//     }
//   }
// );

// export const uploadStatusApi = createAsyncThunk(
//   'uploadStatus/fetch',
//   async ({
//     _id,
//     status
//   }: {
//     _id: string,
//     status: Status[]
//   }, thunkApi) => {
//     try {

//       for (let i = 0; i < status.length; i++) {
//         if (status[i].type === 'image') {
//           status[i].url = await skyUploadImage([status[i].url], _id).then(res => res.data[0])
//         } else {
//           status[i].url = await skyUploadVideo([status[i].url], _id).then(res => res.data[0])
//         }
//         status[i].createdAt = new Date().toISOString()
//         status[i].seen = []
//       }

//       const data = {
//         _id,
//         status
//       }
//       await axios.post(`${localhost}/status/upload`, data)
//       return data.status;
//     } catch (error: any) {
//       return thunkApi.rejectWithValue(error.response.data)
//     }
//   }
// );

interface Status_ {
  userId: string,
  status: Status[]
}
export interface Status_State {
  friendStatus: Status_[]
  fetchLoading: boolean
  fetchError: string | null
  uploadSuccess: boolean
  myStatus: Status_ | null
}


const initialState: Status_State = {
  friendStatus: [],
  fetchLoading: false,
  fetchError: null,
  uploadSuccess: false,
  myStatus: null
}

export const Status_Slice = createSlice({
  name: 'StatusState',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // upload status
      // .addCase(uploadStatusApi.pending, (state) => {
      //   state.fetchLoading = true
      //   state.fetchError = null
      // })
      // .addCase(uploadStatusApi.fulfilled, (state, action) => {
      //   state.uploadSuccess = true
      //   state.fetchLoading = false
      //   state.myStatus?.status.unshift(...action.payload)
      //   // console.log(action.payload)
      // })
      // .addCase(uploadStatusApi.rejected, (state, action) => {
      //   state.fetchLoading = false
      //   state.fetchError = action.payload as string
      // })
      // // fetch profile data
      // .addCase(getFriendStatuses.pending, (state) => {
      //   state.fetchLoading = true
      //   state.fetchError = null
      // })
      // .addCase(getFriendStatuses.fulfilled, (state, action) => {
      //   state.friendStatus = [...state.friendStatus, ...action.payload.friendStatus]
      //   state.myStatus = action.payload.myStatus
      //   state.fetchLoading = false
      //   // console.log(action.payload.myStatus)

      // })
      // .addCase(getFriendStatuses.rejected, (state, action) => {
      //   state.fetchLoading = false
      //   state.fetchError = action.payload as string
      // })

  }
})

// Action creators are generated for each case reducer function
export const {

} = Status_Slice.actions

export default Status_Slice.reducer