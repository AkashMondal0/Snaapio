import { searchUsersProfileApi } from '@/redux/services/users'
import { AuthorData } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface UsersState {
    UserDB: AuthorData[]
    searchUsers: AuthorData[]
    searchUsersLoading: boolean
    searchUsersError: unknown
}
// Define the initial state using that type
const UsersState: UsersState = {
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUsersProfileApi.pending, (state) => {
                state.searchUsersLoading = true
                state.searchUsersError = null
            })
            .addCase(searchUsersProfileApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
                state.searchUsers = action.payload
                state.UserDB.concat(action.payload)
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
    removeAllUserFormSearch
} = UsersSlice.actions

export default UsersSlice.reducer
