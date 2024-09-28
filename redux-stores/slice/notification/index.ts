import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Notification } from '@/types'
import {
    fetchAccountNotificationApi,
    fetchUnreadMessageNotificationCountApi,
    fetchUnreadNotificationCountApi
} from './api.service'

// Define a type for the slice state
type NotificationType = {
    isNotification: boolean,
    notificationCount: number
}
export type loadingType = 'idle' | 'pending' | 'normal'

// Define a type for the slice state
type NotificationStateType = {
    loading: loadingType,
    error: string | null,
    notifications: Notification[]

    notificationPopup: boolean,
    unreadCommentCount: number,
    unreadPostLikeCount: number
    unreadChatCount: number
    postNotification: NotificationType,
    chatNotification: NotificationType,
    commentNotification: NotificationType
    receivedNotification: string[]
}

// Define the initial state using that type
const NotificationState: NotificationStateType = {
    notificationPopup: false,
    loading: "idle",
    error: null,
    notifications: [],
    unreadCommentCount: 0,
    unreadPostLikeCount: 0,
    unreadChatCount: 0,
    receivedNotification: [],

    //
    postNotification: {
        isNotification: false,
        notificationCount: 0
    },
    chatNotification: {
        isNotification: false,
        notificationCount: 0
    },
    commentNotification: {
        isNotification: false,
        notificationCount: 0
    },
}

export const NotificationSlice = createSlice({
    name: 'Notification',
    initialState: NotificationState,
    reducers: {
        setOnNotificationPopup: (state) => {
            state.notificationPopup = true
        },
        setOffNotificationPopup: (state) => {
            state.notificationPopup = false
        },
        setResetNotificationPopup: (state) => {
            state.notificationPopup = false
        },
        setNotification: (state, action: PayloadAction<Notification>) => {
            const find = state.receivedNotification.find((id) => id === action.payload.postId || id === action.payload.commentId)
            if (!find) {
                if (action.payload.type === "like" && action.payload.postId) {
                    state.unreadPostLikeCount += 1
                    state.notificationPopup = true
                    state.receivedNotification.unshift(action.payload.postId)
                }
                if (action.payload.type === "comment" && action.payload.commentId) {
                    state.unreadCommentCount += 1
                    state.notificationPopup = true
                    state.receivedNotification.unshift(action.payload.commentId)
                }
            }
        },
        setChatNotification: (state, action: PayloadAction<NotificationType>) => {
            state.chatNotification = action.payload
        },
        setCommentNotification: (state, action: PayloadAction<NotificationType>) => {
            state.commentNotification = action.payload
        },
        resetNotificationState: (state) => {
            state.unreadCommentCount = 0
            state.unreadPostLikeCount = 0
            state.unreadChatCount = 0
            state.notifications = []
            state.receivedNotification = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccountNotificationApi.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(fetchAccountNotificationApi.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.notifications.push(...action.payload)
                state.loading = 'normal'
            })
            .addCase(fetchAccountNotificationApi.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload || 'Failed to fetch notification'
                state.loading = "normal"
            })
            // fetchUnreadNotificationCountApi
            .addCase(fetchUnreadNotificationCountApi.pending, (state) => {

            })
            .addCase(fetchUnreadNotificationCountApi.fulfilled, (state, action: PayloadAction<{
                unreadCommentCount: number,
                unreadPostCount: number,
                unreadChatCount: number
            }>) => {
                state.unreadCommentCount = action.payload.unreadCommentCount ?? 0
                state.unreadPostLikeCount = action.payload.unreadPostCount ?? 0
                state.unreadChatCount = action.payload.unreadChatCount ?? 0
            })
            .addCase(fetchUnreadNotificationCountApi.rejected, (state, action: PayloadAction<any>) => {

            })
            //fetchUnreadMessageNotificationCountApi
            .addCase(fetchUnreadMessageNotificationCountApi.pending, (state) => {

            })
            .addCase(fetchUnreadMessageNotificationCountApi.fulfilled, (state, action: PayloadAction<number>) => {
                state.unreadChatCount = action.payload ?? 0
            })
            .addCase(fetchUnreadMessageNotificationCountApi.rejected, (state, action: PayloadAction<any>) => {

            })
    },
})

export const {
    setOnNotificationPopup,
    setOffNotificationPopup,
    setResetNotificationPopup,
    setNotification,
    setChatNotification,
    setCommentNotification,
    resetNotificationState
} = NotificationSlice.actions

export default NotificationSlice.reducer