import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loadingType, Session } from '@/types'
import { logoutApi, profileUpdateApi } from './api.service'
import { ThemeNameType, ThemeSchemaType } from 'hyper-native-ui'


export type AuthState = {
  session: Session
  theme: {
    themeSchema: ThemeSchemaType,
    themeName: ThemeNameType,
  }
  loaded: loadingType
  loading: boolean
  error: string | null
}


const initialState: AuthState = {
  session: {
    user: null,
  },
  theme: {
    themeName: "Zinc",
    themeSchema: "system",
  },
  loaded: "idle",
  loading: false,
  error: null
}

export const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setThemeSchema: (state, action: PayloadAction<ThemeSchemaType>) => {
      if (!action.payload) return;
      state.theme.themeSchema = action.payload;
    },
    setThemeName: (state, action: PayloadAction<ThemeNameType>) => {
      if (!action.payload) return;
      state.theme.themeName = action.payload
    },
    setSession: (state, action: PayloadAction<Session['user']>) => {
      state.session.user = action.payload
      state.loaded = "normal"
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
  logout,
  setThemeSchema,
  setThemeName
} = AuthSlice.actions

export default AuthSlice.reducer