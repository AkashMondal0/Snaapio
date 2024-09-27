import { configureStore } from '@reduxjs/toolkit'
import ThemeReducer from './slice/theme'
import AuthReducer from './slice/auth'
import AccountReducer from './slice/account'
import ConversationReducer from './slice/conversation'
import PostReducer from './slice/post'
import ProfileReducer from './slice/profile'
import UsersReducer from './slice/users'
import NotificationReducer from './slice/notification'

export const store = configureStore({
  reducer: {
    ThemeState: ThemeReducer,
    AuthState: AuthReducer,
    AccountState: AccountReducer,
    ConversationState: ConversationReducer,
    PostState: PostReducer,
    ProfileState: ProfileReducer,
    UsersState: UsersReducer,
    NotificationState: NotificationReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch