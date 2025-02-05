import { graphqlQuery } from "@/lib/GraphqlQuery";
import { findDataInput } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NQ } from "./notification.queries";

export const createNotificationApi = createAsyncThunk(
  'createNotificationApi/post',
  async (postActionsProps: any, thunkAPI) => {
    try {
      const res = await graphqlQuery({
        query: NQ.createNotification,
        variables: {
          createNotificationInput: {
            type: postActionsProps.type,
            recipientId: postActionsProps.recipientId,
            authorId: postActionsProps.authorId,
            postId: postActionsProps.postId,
            commentId: postActionsProps.commentId,
            storyId: postActionsProps.storyId,
            reelId: postActionsProps.reelId
          }
        }
      })
      return res
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        ...error?.response?.data,
      })
    }
  }
);

export const destroyNotificationApi = createAsyncThunk(
  'destroyNotificationApi/post',
  async (postActionsProps: any, thunkAPI) => {
    try {
      const res = await graphqlQuery({
        query: NQ.destroyNotification,
        variables: {
          destroyNotificationInput: {
            type: postActionsProps.type,
            recipientId: postActionsProps.recipientId,
            authorId: postActionsProps.authorId,
            postId: postActionsProps.postId,
            commentId: postActionsProps.commentId,
            storyId: postActionsProps.storyId,
            reelId: postActionsProps.reelId
          }
        }
      })
      return res
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        ...error?.response?.data,
      })
    }
  }
);


export const fetchAccountNotificationApi = createAsyncThunk(
  'fetchAccountNotificationApi/post',
  async (findAllNotificationInput: findDataInput, thunkAPI) => {
    try {
      const res = await graphqlQuery({
        query: NQ.findAllNotifications,
        variables: { findAllNotificationInput }
      })
      return res
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        ...error?.response?.data,
      })
    }
  }
);

export const fetchUnreadNotificationCountApi = createAsyncThunk(
  'fetchUnreadNotificationCountApi/post',
  async (_, thunkAPI) => {
    try {
      const res = await graphqlQuery({
        query: NQ.unseenNotifications,
      })
      return res
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        ...error?.response?.data,
      })
    }
  }
);

// fetchUnreadMessageNotificationCountApi

export const fetchUnreadMessageNotificationCountApi = createAsyncThunk(
  'fetchUnreadMessageNotificationCountApi/post',
  async (_, thunkAPI) => {
    try {
      const res = await graphqlQuery({
        query: NQ.UnseenMessageNotifications,
      })
      return res
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        ...error?.response?.data,
      })
    }
  }
);