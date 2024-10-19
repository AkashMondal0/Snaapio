import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Session } from '@/types'
import { logoutApi, profileUpdateApi } from './api.service'


export type AuthState = {
  session: Session
  loading: boolean
  error: string | null
}


const initialState: AuthState = {
  session: {
    user: null,
  },
  loading: false,
  error: null
}

export const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session['user']>) => {
      state.session.user = action.payload
    },
    updateSession: (state, action: PayloadAction<Partial<Session['user']>>) => {
      if (!state.session.user) return
      state.session.user = {
        ...state.session.user,
        ...action.payload
      }
    },
    logout: (state) => {
      state.session.user = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(profileUpdateApi.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(profileUpdateApi.fulfilled, (state, action) => {
      if (!state.session.user) return
      state.session.user = {
        ...state.session.user,
        ...action.payload
      }
      state.loading = false
    })
    builder.addCase(profileUpdateApi.rejected, (state) => {
      state.error = 'Failed to update profile'
      state.loading = false
    })
    builder.addCase(logoutApi.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(logoutApi.fulfilled, (state) => {
      state.session.user = null
      state.loading = false
    })
    builder.addCase(logoutApi.rejected, (state) => {
      state.error = 'Failed to logout'
      state.loading = false
    })
  }
})

export const {
  setSession,
  updateSession,
  logout
} = AuthSlice.actions

export default AuthSlice.reducer