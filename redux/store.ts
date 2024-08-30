import { configureStore } from '@reduxjs/toolkit'
import ThemeReducer from '../redux/slice/theme'

export const store = configureStore({
  reducer: {
    ThemeState: ThemeReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch