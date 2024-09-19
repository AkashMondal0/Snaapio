import { configureStore } from '@reduxjs/toolkit'
import ThemeReducer from './slice/theme'
import AuthReducer from './slice/auth'
import AccountReducer from './slice/account'

export const store = configureStore({
  reducer: {
    ThemeState: ThemeReducer,
    AuthState: AuthReducer,
    AccountState: AccountReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch