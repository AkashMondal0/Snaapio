import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Session } from '@/types'


export type AuthState = {
  session: Session
}


const initialState: AuthState = {
  session: {
    user: null,
  }
}

export const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session['user']>) => {
      state.session.user = action.payload
    },
    logout: (state) => {
      state.session.user = null
    }
  },
})

export const {
  setSession,
  logout
} = AuthSlice.actions

export default AuthSlice.reducer