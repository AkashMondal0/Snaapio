import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { incomingCallAnswerApi, sendCallingRequestApi } from './api.service';
import { AuthorData } from '@/types';
type CallRes = {
  message: "Call Accept",
  data: true,
  userData: AuthorData,
  acceptCall: boolean
}
export type CallSessionUser = {
  username: string;
  email: string | null | any
  id: string;
  name: string;
  profilePicture: string | null
}
export type IncomingCallData = {
  members: string[]
  isVideo: boolean,
  status: "calling" | "hangUp"
  userData: {
    username: string;
    email: string | null | any
    id: string;
    name: string;
    profilePicture: string | null
  }
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
  inComingCall: IncomingCallData | null
  callingAnswer: "PENDING" | "ACCEPT" | "DECLINE" | "IDLE"
  callState: "CONNECTED" | "DISCONNECTED" | "PENDING" | "IDLE"
}

const initialState: CallState = {
  inComingCall: null,
  callingAnswer: "IDLE",
  callState: "IDLE"
}

export const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setIncomingCall: (state, action: PayloadAction<IncomingCallData | null>) => {
      state.inComingCall = action.payload
      state.callState = "IDLE"
    },
    setAnswerIncomingCall: (state, action: PayloadAction<"PENDING" | "ACCEPT" | "DECLINE" | "IDLE">) => {
      state.callingAnswer = action.payload
    },
    setCallConnected: (state) => {
      state.callState = "CONNECTED"
    },
    setEndCall: (state) => {
      state.callingAnswer = "IDLE";
      state.inComingCall = null;
      state.callState = "DISCONNECTED"
    }
  },
  extraReducers: (builder) => {
    // sendCallingRequestApi
    builder.addCase(sendCallingRequestApi.pending, (state) => {
      state.callingAnswer = "PENDING"
      state.callState = "PENDING"
    })
    builder.addCase(sendCallingRequestApi.fulfilled, (state, action: PayloadAction<CallRes>) => {

    })
    builder.addCase(sendCallingRequestApi.rejected, (state) => {
      state.callingAnswer = "DECLINE"
      state.callState = "IDLE"
    })
    // incomingCallAnswerApi
    // builder.addCase(incomingCallAnswerApi.pending, (state) => {

    // })
    // builder.addCase(incomingCallAnswerApi.fulfilled, (state, action: PayloadAction<CallRes>) => {
    //   state.currentCallingState = true
    // })
    // builder.addCase(incomingCallAnswerApi.rejected, (state) => {

    // })
  }
})

// Action creators are generated for each case reducer function
export const {
  setIncomingCall,
  setAnswerIncomingCall,
  setEndCall,
  setCallConnected
} = callSlice.actions

export default callSlice.reducer