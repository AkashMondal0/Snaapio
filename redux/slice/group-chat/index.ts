import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import { localhost } from '../../../keys';
import { skyUploadImage, skyUploadVideo } from '../../../utils/upload-file';
import { GroupConversation, PrivateMessage, PrivateMessageSeen } from '../../../types/private-chat';
import { Assets, User } from '../../../types/profile';
import socket from '../../../utils/socket-connect';

export const createGroup = createAsyncThunk(
  'createGroup/fetch',
  async (data: {
    name: string
    description: string,
    picture: string,
    members: string[],
    authorId: string[0]
  }, thunkApi) => {
    try {
      const image = data?.picture ? await skyUploadImage([data.picture], data.authorId).then(res => res.data[0]) : null
      const _data = {
        users: [...data.members, data.authorId],
        name: data.name,
        description: data.description,
        authorId: data.authorId,
        picture: image
      }
      const response = await axios.post(`${localhost}/groupConversation/chat/connection`, _data);
      thunkApi.dispatch(addOneGroupChatListItem(response.data))
      const refreshUserList = {
        receiverIds: data.members,
      }
      socket.emit('group_chat_connection_sender', refreshUserList)
      return response.data
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const getGroupChatList = createAsyncThunk(
  'getGroupChatList/fetch',
  async (token: string | null, thunkApi) => {
    try {

      const response = await axios.get(`${localhost}/groupConversation/chat/list/`, {
        headers: {
          token: token ? token : await AsyncStorage.getItem("token")
        }
      });
      return response.data?.groupChatList || []
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const sendMessageGroup = createAsyncThunk(
  'sendMessageGroup/post',
  async ({
    content,
    member,
    receiverIds,
    conversationId,
    assets
  }: {
    content: string,
    member: User,
    receiverIds: string[],
    conversationId: string,
    assets: Assets[]
  }, thunkApi) => {
    try {

      const sendMessageApi = async (files: File[]) => {
        const newMessage: PrivateMessage = {
          _id: new Date().getTime().toString(),
          content: content,
          memberId: member._id,
          memberDetails: member,
          conversationId: conversationId,
          senderId: member._id,
          receiverIds: receiverIds.filter(item => item !== member._id),
          deleted: false,
          fileUrl: files.length >= 1 ? files : null as any,
          seenBy: [
            member._id,
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          receiverId: ''
        }
        socket.emit('group_message_sender', newMessage)
        return newMessage
      }

      if (assets.length >= 1) {

        for (let i = 0; i < assets.length; i++) {
          if (assets[i].type === 'image') {
            assets[i].url = await skyUploadImage([assets[i].url], member._id).then(res => res.data[0])
          } else {
            assets[i].url = await skyUploadVideo([assets[i].url], member._id).then(res => res.data[0])
          }
        }

        assets.map(item => {
          return {
            url: item.url,
            type: item.type,
            caption: item.caption
          }
        })
        const sendMessage = await sendMessageApi(assets as any)

        thunkApi.dispatch(addToGroupChatListMessage(sendMessage))
        return sendMessage
      } else {
        const sendMessage = await sendMessageApi(assets as any)

        thunkApi.dispatch(addToGroupChatListMessage(sendMessage))
        return sendMessage
      }
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const sendMessageSeenGroup = createAsyncThunk(
  'sendMessageSeenGroup/fetch',
  async (data: PrivateMessageSeen, thunkApi) => {
    try {
      socket.emit('group_message_seen_sender', data)
      thunkApi.dispatch(addToGroupChatListMessageSeen(data))
      return data
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export interface Group_conversation_State {
  loading: boolean
  error: string | null
  groupChatList: GroupConversation[]
}

const initialState: Group_conversation_State = {
  loading: false,
  error: null,
  groupChatList: []
}

export const Group_conversation_Slice = createSlice({
  name: 'Group_conversation',
  initialState,
  reducers: {
    setAllGroupChatList: (state, action: PayloadAction<GroupConversation[]>) => {
      state.groupChatList = action.payload
    },
    addOneGroupChatListItem: (state = initialState, action: PayloadAction<GroupConversation>) => {
      state.groupChatList.push(action.payload)
    },
    addToGroupChatListMessage: (state, action: PayloadAction<PrivateMessage>) => {
      // console.log(action.payload)
      const index = state.groupChatList.findIndex(item => item._id === action.payload.conversationId)
      const duplicateMessage = state.groupChatList[index].messages?.find(item => item._id === action.payload._id)
      if (index !== -1 && !duplicateMessage) {
        state.groupChatList[index].lastMessageContent = action.payload.content
        state.groupChatList[index].updatedAt = action.payload.createdAt
        state.groupChatList[index].messages?.push(action.payload)
      }
    },
    addToGroupChatListMessageSeen : (state, action: PayloadAction<PrivateMessageSeen>) => {
      const index = state.groupChatList.findIndex(item => item._id === action.payload.conversationId)
      if (index !== -1) {
        state.groupChatList[index].messages?.forEach(item => {
          action.payload.messageIds.map(messageId => {
            if (item._id === messageId && !item.seenBy.includes(action.payload.memberId)) {
              item.seenBy.push(action.payload.memberId)
            }
          })
        })
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createGroup.rejected, (state) => {
        state.loading = false
      })
      .addCase(getGroupChatList.pending, (state) => {
        state.loading = true
      })
      .addCase(getGroupChatList.fulfilled, (state, action) => {
        state.loading = false
        state.groupChatList = action.payload
      })
      .addCase(getGroupChatList.rejected, (state) => {
        state.loading = false
      })
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllGroupChatList,
  addToGroupChatListMessage,
  addOneGroupChatListItem,
  addToGroupChatListMessageSeen
} = Group_conversation_Slice.actions

export default Group_conversation_Slice.reducer