import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

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
}

const initialState: CallState = {
  currentCallingState: false,
  callSessionState: null
}

export const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {

  },
})

// Action creators are generated for each case reducer function
export const {

} = callSlice.actions

export default callSlice.reducer