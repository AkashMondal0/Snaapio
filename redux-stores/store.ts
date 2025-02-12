import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthReducer from './slice/auth'
import AccountReducer from './slice/account'
import ConversationReducer from './slice/conversation'
import PostReducer from './slice/post'
import ProfileReducer from './slice/profile'
import UsersReducer from './slice/users'
import NotificationReducer from './slice/notification'
import DialogsReducer from './slice/dialog'
import CounterReducer from './slice/counterState'


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'AuthState',
    'AccountState',
    'ConversationState',
    'PostState',
    'ProfileState',
    'UsersState',
    'NotificationState',
  ],
  blacklist: [
    'CounterState',
    'DialogsState',
  ]
};
// Combine reducers
const rootReducer = combineReducers({
  AuthState: AuthReducer,
  AccountState: AccountReducer,
  ConversationState: ConversationReducer,
  PostState: PostReducer,
  ProfileState: ProfileReducer,
  UsersState: UsersReducer,
  NotificationState: NotificationReducer,
  DialogsState: DialogsReducer,
  CounterState: CounterReducer
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Persistor for Redux Persist
const persistor = persistStore(store);

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch