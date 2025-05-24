import { AuthorData, loadingType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { discoverUsersProfileApi, searchUsersProfileApi } from './api.service'

// Define a type for the slice state
export interface UsersStateType {
    UserDB: AuthorData[]
    searchUsers: AuthorData[]
    searchUsersLoading: loadingType
    searchUsersError: unknown

    // 
    discoverUsers: AuthorData[]
    discoverUsersLoading: loadingType
    discoverUsersError: unknown
}
// Define the initial state using that type
const UsersState: UsersStateType = {
    UserDB: [],
    searchUsers: [],
    searchUsersLoading: "idle",
    searchUsersError: null,
    discoverUsers: [],
    discoverUsersLoading: "idle",
    discoverUsersError: null
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
                state.searchUsersLoading = "pending"
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
                state.searchUsersLoading = "normal"
            })
            .addCase(searchUsersProfileApi.rejected, (state, action) => {
                state.searchUsersLoading = "normal"
                state.searchUsersError = action.payload
            })
            // 
            .addCase(discoverUsersProfileApi.pending, (state) => {
                state.discoverUsersLoading = "pending"
                state.discoverUsersError = null
            })
            .addCase(discoverUsersProfileApi.fulfilled, (state, action: PayloadAction<AuthorData[]>) => {
                state.discoverUsers = action.payload.map((item) => {
                    const exist = state.discoverUsers.find((user) => user.id === item.id)
                    if (!exist) {
                        return item
                    }
                    return null
                }).filter((item) => item !== null)
                state.discoverUsersLoading = "normal"
            })
            .addCase(discoverUsersProfileApi.rejected, (state, action) => {
                state.discoverUsersLoading = "normal"
                state.discoverUsersError = action.payload
            })
    },
})

export const {
    removeUserByIdFormSearch,
    removeAllUserFormSearch,
    resetUserState
} = UsersSlice.actions

export default UsersSlice.reducer
