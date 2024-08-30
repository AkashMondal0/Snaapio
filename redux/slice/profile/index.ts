import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit'
import { Status, User } from '../../../types/profile';
import axios from 'axios';
import socket from '../../../utils/socket-connect';
import { localhost } from '../../../keys';
import { Login } from '../auth';
import { getProfileChatList } from '../private-chat';
import { skyUploadImage, skyUploadVideo } from '../../../utils/upload-file';
import { getGroupChatList } from '../group-chat';

export const fetchProfileData = createAsyncThunk(
    'profileData/fetch',
    async (token: string | null, thunkApi) => {
        try {
            token = token ? token : await AsyncStorage.getItem('token') as string
            const response = await axios.get(`${localhost}/auth/authorization`, {
                headers: {
                    Authorization: token
                }
            })
            thunkApi.dispatch(Login({ token }))
            thunkApi.dispatch(getProfileChatList(token) as any)
            thunkApi.dispatch(getGroupChatList(token) as any)
            return response.data;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const uploadStatusApi = createAsyncThunk(
    'uploadStatus/fetch',
    async ({
        _id,
        status
    }: {
        _id: string,
        status: Status[]
    }, thunkApi) => {
        try {

            for (let i = 0; i < status.length; i++) {
                if (status[i].type === 'image') {
                    status[i].url = await skyUploadImage([status[i].url], _id).then(res => res.data[0])
                } else {
                    status[i].url = await skyUploadVideo([status[i].url], _id).then(res => res.data[0])
                }
                status[i].createdAt = new Date().toISOString()
                status[i].seen = []
            }

            const data = {
                _id,
                status
            }
            await axios.post(`${localhost}/status/upload`, data)
            return data.status;
        } catch (error: any) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);


const RemoveTokenLocal = async () => {
    try {
        await AsyncStorage.removeItem('token')
    } catch (err) {
        console.log("Error in saving theme from redux async storage", err)
    }
}

export interface Profile_State {
    user?: User | null
    loading?: boolean
    error?: string | null | any
    splashLoading?: boolean
    isLogin?: boolean
}

const initialState: Profile_State = {
    user: null,
    loading: false,
    error: null,
    splashLoading: true,
    isLogin: false
}

export const Profile_Slice = createSlice({
    name: 'Profile',
    initialState,
    reducers: {
        profileUpdate: (state, action: PayloadAction<Profile_State>) => {
            state.user = action.payload.user
        },
        profileSet: (state, action: PayloadAction<Profile_State>) => {
            state.user = action.payload.user
        },
        resetProfileState: (state) => {
            state.user = null
            state.loading = false
            state.error = null
            state.isLogin = false
            RemoveTokenLocal()
            // socket.disconnect()
        },
        SplashLoading: (state, action: PayloadAction<boolean>) => {
            state.splashLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch authorize profile data
            .addCase(fetchProfileData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfileData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.splashLoading = false
                state.isLogin = true
                socket.emit("user_connect", {
                    user: action.payload,
                    socketId: socket.id
                }) // connect to socket
            })
            .addCase(fetchProfileData.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // upload status
            .addCase(uploadStatusApi.pending, (state,) => {
                state.loading = true;
            })
            .addCase(uploadStatusApi.fulfilled, (state, action) => {
                state.loading = false;
                state.user?.status?.push(...action.payload)
                // console.log("action.payload", action.payload)
            })
            .addCase(uploadStatusApi.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })

    },
})

// Action creators are generated for each case reducer function
export const {
    profileUpdate,
    profileSet,
    resetProfileState,
    SplashLoading
} = Profile_Slice.actions

export default Profile_Slice.reducer