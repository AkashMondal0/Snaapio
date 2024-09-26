import { AuthorData } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { searchUsersProfileApi } from './api.service'

// Define a type for the slice state
export interface UsersStateType {
    UserDB: AuthorData[]
    searchUsers: AuthorData[]
    searchUsersLoading: boolean
    searchUsersError: unknown
}
// Define the initial state using that type
const UsersState: UsersStateType = {
    UserDB: [],
    searchUsers: [],
    searchUsersLoading: false,
    searchUsersError: null
}

export const UsersSlice = createSlice({
    name: 'Users',
    initialState: UsersState,
    reducers: {
        removeUserByIdFormSearch: (state, action: PayloadAction<AuthorData["id"]>) => {
            state.searchUsers = state.searchUsers.filter(item => item.id !== action.payload)
        },
        removeAllUserFormSearch: (state) => {
            state.searchUsers = []
        },
        resetUserState: (state) => {
            state.UserDB = []
            state.searchUsers = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUsersProfileApi.pending, (state) => {
                state.searchUsersLoading = true
                state.searchUsersError = null
            })
            .addCase(searchUsersProfileApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
                state.searchUsers = action.payload.map((item) => {
                    const exist = state.searchUsers.find((user) => user.id === item.id)
                    if (!exist) {
                        return item
                    }
                    return null
                }).filter((item) => item !== null)
                state.searchUsersLoading = false
            })
            .addCase(searchUsersProfileApi.rejected, (state, action) => {
                state.searchUsersLoading = false
                state.searchUsersError = action.payload
            })
    },
})

export const {
    removeUserByIdFormSearch,
    removeAllUserFormSearch,
    resetUserState
} = UsersSlice.actions

export default UsersSlice.reducer
