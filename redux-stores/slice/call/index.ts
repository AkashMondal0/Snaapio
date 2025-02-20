import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
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
  callStatus: "CONNECTED" | "DISCONNECTED" | "PENDING" | "IDLE"

}

const initialState: CallState = {
  callStatus: "IDLE"
}

export const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setCallStatus: (state, action: PayloadAction<"CONNECTED" | "DISCONNECTED" | "PENDING" | "IDLE">) => {
      state.callStatus = action.payload
    }
  },
  extraReducers: (builder) => {
    // sendCallingRequestApi

  }
})

// Action creators are generated for each case reducer function
export const {
  setCallStatus,
} = callSlice.actions

export default callSlice.reducer