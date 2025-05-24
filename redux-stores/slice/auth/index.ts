import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loadingType, Session } from '@/types'
import { loginApi, logoutApi, profileUpdateApi, registerApi } from './api.service'
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

  loginLoading: boolean
  loginError: string | null

  registerLoading: boolean
  registerError: string | null

  location: { lat: number; lon: number, status: "granted" | "denied" };
}


const initialState: AuthState = {
  session: {
    user: null,
  },
  theme: {
    themeName: "Zinc",
    themeSchema: "system",
  },
  loading: false,
  error: null,
  loaded: 'idle',

  loginLoading: false,
  registerLoading: false,
  loginError: null,
  registerError: null,

  location: {
    lat: 0,
    lon: 0,
    status: "denied"
  },
}

export const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ lat: number; lon: number, status: "granted" | "denied" }>) => {
      if (!action.payload) return;
      state.location = action.payload;
    },
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
    },
    clearLoginError: (state) => {
      state.error = null;
      state.loading = false;
      state.loginLoading = false;
      state.registerLoading = false;
      state.loginError = null;
      state.registerError = null;
    },
  },
  extraReducers: (builder) => {
    // update profile
    builder.addCase(profileUpdateApi.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(profileUpdateApi.fulfilled, (state, action) => {
      if (!state.session.user) return
      state.session.user = {
        ...state.session.user,
        bio: action.payload.bio || state.session.user.bio,
        name: action.payload.name || state.session.user.name,
        username: action.payload.username || state.session.user.username,
        email: action.payload.email || state.session.user.email,
        profilePicture: action.payload.profilePicture || state.session.user.profilePicture,
      }
      state.loading = false
    })
    builder.addCase(profileUpdateApi.rejected, (state) => {
      state.error = 'Failed to update profile'
      state.loading = false
    })
    // login
    builder.addCase(loginApi.pending, (state) => {
      state.loginError = null
      state.loginLoading = true
    })
    builder.addCase(loginApi.fulfilled, (state, action: PayloadAction<Session["user"]>) => {
      state.session.user = action.payload;
      state.loginLoading = false;
    })
    builder.addCase(loginApi.rejected, (state, action: PayloadAction<any>) => {
      state.loginError = action.payload?.message || 'Internal Error Failed to logout'
      state.loginLoading = false
    })
    // register
    builder.addCase(registerApi.pending, (state) => {
      state.registerLoading = true
      state.registerError = null
    })
    builder.addCase(registerApi.fulfilled, (state, action: PayloadAction<Session["user"]>) => {
      state.session.user = action.payload;
      state.registerLoading = false;
    })
    builder.addCase(registerApi.rejected, (state, action: PayloadAction<any>) => {
      state.registerLoading = false
      state.registerError = action.payload?.message || "Internal Error Failed to register"
    })
    // logout
    builder.addCase(logoutApi.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(logoutApi.fulfilled, (state) => {
      state.session.user = null
      state.loading = false
      state.location = {
        lat: 0,
        lon: 0,
        status: "denied"
      };
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
  setThemeName,
  clearLoginError,
  setLocation,
} = AuthSlice.actions

export default AuthSlice.reducer