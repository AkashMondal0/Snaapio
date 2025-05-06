import { Post } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type dialogsType = {
    appPermission: {
        visible: boolean,
        data?: any | null
    },
    logOut: {
        visible: boolean,
        data?: any | null
    },
    shareSheetData: Post | null
}

const initialState: dialogsType = {
    appPermission: {
        visible: false,
        data: null
    },
    logOut: {
        visible: false,
        data: null
    },
    shareSheetData: null
}

export const Dialogs = createSlice({
    name: 'Dialogs',
    initialState,
    reducers: {
        setAppPermissionDialog: (state, action: PayloadAction<{ visible: boolean, data: any }>) => {
            state.appPermission = action.payload
        },
        setLogOutDialog: (state, action: PayloadAction<{ visible: boolean, data: any }>) => {
            state.logOut = action.payload
        },
        setShareSheetData: (state, action: PayloadAction<Post | any>) => {
            state.shareSheetData = action.payload
        },
    }
})

export const {
    setAppPermissionDialog,
    setLogOutDialog,
    setShareSheetData
} = Dialogs.actions

export default Dialogs.reducer