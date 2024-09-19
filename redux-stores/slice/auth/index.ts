import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Session } from '@/types'


export type AuthState = {
  session: Session
}


const initialState: AuthState = {
  session: {
    user: null,
    token: '',
  }
}

export const AuthSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.session = action.payload
    },
  },

})

export const {

} = AuthSlice.actions

export default AuthSlice.reducer