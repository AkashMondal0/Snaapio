import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { incomingCallAnswerApi, sendCallingRequestApi } from './api.service';
import { AuthorData } from '@/types';
type CallRes = {
  message: "Call Accept",
  data: true,
  userData: AuthorData
}
export type CallSessionUser = {
  username: string;
  email: string | null | any
  id: string;
  name: string;
  profilePicture: string | null
}
export type Participants = {
  sessionId: string
  user: CallSessionUser
  privateSession: boolean
  riseHand: boolean
  micOn: boolean
  videoOn: boolean
}

export type CallSession = {
  sessionId: string;
  participants: Participants[];
  createdAt: String;
  privateSession: boolean;
}

export interface CallState {
  currentCallingState: boolean
  callSessionState: CallSession | null
  inComingCall: CallSession | null
  calling: CallSession | null
}

const initialState: CallState = {
  currentCallingState: false,
  callSessionState: null,
  inComingCall: null,
  calling: null
}

export const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setIncomingCall: (state, action: PayloadAction<CallSession>) => {
      state.inComingCall = action.payload
    }
  },
  extraReducers: (builder) => {
    // sendCallingRequestApi
    builder.addCase(sendCallingRequestApi.pending, (state) => {

    })
    builder.addCase(sendCallingRequestApi.fulfilled, (state, action: PayloadAction<CallRes>) => {

    })
    builder.addCase(sendCallingRequestApi.rejected, (state) => {

    })
    // incomingCallAnswerApi
    builder.addCase(incomingCallAnswerApi.pending, (state) => {

    })
    builder.addCase(incomingCallAnswerApi.fulfilled, (state, action: PayloadAction<CallRes>) => {

    })
    builder.addCase(incomingCallAnswerApi.rejected, (state) => {

    })
  }
})

// Action creators are generated for each case reducer function
export const {
  setIncomingCall
} = callSlice.actions

export default callSlice.reducer