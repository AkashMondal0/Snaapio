import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { File, PrivateChat, PrivateMessage, PrivateMessageSeen, typingState } from '../../../types/private-chat';
import axios from 'axios';
import socket from '../../../utils/socket-connect';
import { localhost } from '../../../keys';
import { Assets, User } from '../../../types/profile';
import uid from '../../../utils/uuid';
import { skyUploadImage, skyUploadVideo } from '../../../utils/upload-file';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const createConnectionApi = createAsyncThunk(
  'createConnectionApi/post',
  async ({
    profileId,
    userId
  }: {
    profileId: string,
    userId: string
  }, thunkApi) => {
    try {
      const res = await axios.post(`${localhost}/private/chat/connection`, {
        users: [
          profileId, userId
        ]
      })
      return res.data
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const createPrivateChatConversation = createAsyncThunk(
  'createPrivateChatConversation/post',
  async ({
    users,
    content,
    conversation,
    assets
  }: {
    users: User[],
    content: string,
    conversation: PrivateChat,
    assets: Assets[]
  }, thunkApi) => {
    try {
      for (let i = 0; i < assets.length; i++) {
        if (assets[i].type === 'image') {
          assets[i].url = await skyUploadImage([assets[i].url], users[0]._id).then(res => res.data[0])
        } else {
          assets[i].url = await skyUploadVideo([assets[i].url], users[0]._id).then(res => res.data[0])
        }
      }

      assets.map(item => {
        return {
          url: item.url,
          type: item.type,
          caption: item.caption
        }
      })

      const newMessage2: PrivateMessage = {
        _id: uid(),
        content: content,
        memberId: users[0]._id,
        memberDetails: users[0],
        conversationId: conversation._id as string,
        senderId: users[0]._id,
        receiverId: users[1]._id,
        fileUrl: assets.length >= 1 ? assets as File[] : null,
        deleted: false,
        seenBy: [
          users[0]._id
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      socket.emit('update_Chat_List_Sender', {
        receiverId: users[1]._id,
        senderId: users[0]._id,
        chatData: conversation
      });
      socket.emit('message_sender', newMessage2)
      const conversationData: PrivateChat = {
        ...conversation,
        messages: [newMessage2],
        lastMessageContent: newMessage2.content,
        updatedAt: newMessage2.createdAt,
        userDetails: users[1]
      }
      thunkApi.dispatch(addToPrivateChatList(conversationData))
      return conversation
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const getMoreMessagePrivate = createAsyncThunk(
  'getMoreMessagePrivate/post',
  async ({
    conversationId,
    page
  }: {
    conversationId: string,
    page: number,
  }, thunkApi) => {
    try {
      const res = await axios.get(`${localhost}/private/chat/list/messages/${conversationId}?page=${page}&size=${20}`)

      if (res.data?.length === 0) {
        return {
          AllMessagesLoaded: true,
          messages: [],
          conversationId: conversationId,
          pageCount: page
        }
      } else {
        return {
          AllMessagesLoaded: false,
          messages: res.data,
          conversationId: conversationId,
          pageCount: page + 1
        }
      }
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const sendMessagePrivate = createAsyncThunk(
  'sendMessagePrivate/post',
  async ({
    content,
    member,
    receiver,
    conversationId,
    assets
  }: {
    content: string,
    member: User,
    receiver: User,
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
          receiverId: receiver._id,
          deleted: false,
          fileUrl: files.length >= 1 ? files : null,
          seenBy: [
            member._id,
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        socket.emit('message_sender', newMessage)
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

        return sendMessageApi(assets as File[])
      } else {
        return sendMessageApi([])
      }
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const sendMessageSeenPrivate = createAsyncThunk(
  'sendMessageSeenPrivate/post',
  async ({
    seen
  }: {
    seen: PrivateMessageSeen
  }, thunkApi) => {
    try {
      socket.emit('message_seen_sender', seen)
      thunkApi.dispatch(addToPrivateChatListMessageSeen(seen))
      return seen
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export const getProfileChatList = createAsyncThunk(
  'chatList/fetch',
  async (token: string | null, thunkApi) => {
    try {

      const response = await axios.get(`${localhost}/private/chat/list`, {
        headers: {
          token: token ? token : await AsyncStorage.getItem("token")
        }
      });
      // console.log(response.data)
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data)
    }
  }
);

export interface Private_Chat_State {
  List: PrivateChat[]
  loading: boolean
  error: string | null | any
  success: string | null | any
  updateList: "true" | "false" | boolean;
  recentChat: PrivateChat | null
  messageLoading: boolean
  messageSendLoading: boolean
  newConversationId: string | null
  friendListWithDetails: User[]
}


const initialState: Private_Chat_State = {
  List: [],
  loading: false,
  error: null,
  success: null,
  updateList: "false",
  recentChat: null,
  messageLoading: false,
  messageSendLoading: false,
  newConversationId: null,
  friendListWithDetails: []
}

export const Private_Chat_Slice = createSlice({
  name: 'Private_chat',
  initialState,
  reducers: {
    addToPrivateChatList: (state, action: PayloadAction<PrivateChat>) => {
      // console.log(action.payload)
      if (!state.List.find(item => item._id === action.payload._id)) {
        state.List.push(action.payload)
      }
    },
    addToPrivateChatListMessage: (state, action: PayloadAction<PrivateMessage>) => {
      // console.log(action.payload)
      const index = state.List.findIndex(item => item._id === action.payload.conversationId)
      const duplicateMessage = state.List[index].messages?.find(item => item._id === action.payload._id)
      if (index !== -1 && !duplicateMessage) {
        state.List[index].lastMessageContent = action.payload.content
        state.List[index].updatedAt = action.payload.createdAt
        state.List[index].messages?.push(action.payload)
      }
    },
    addToPrivateChatListMessageSeen: (state, action: PayloadAction<PrivateMessageSeen>) => {
      const index = state.List.findIndex(item => item._id === action.payload.conversationId)
      if (index !== -1) {
        state.List[index].messages?.forEach(item => {
          action.payload.messageIds.map(messageId => {
            if (item._id === messageId && !item.seenBy.includes(action.payload.memberId)) {
              item.seenBy.push(action.payload.memberId)
            }
          })
        })
      }
    },
    addToPrivateChatListMessageTyping: (state, action: PayloadAction<typingState>) => {
      const index = state.List.findIndex(item => item._id === action.payload.conversationId)
      if (index !== -1) {
        state.List[index].typing = action.payload.typing
      }
    },
    setUserStatus: (state, action: PayloadAction<{ userId: string, status: boolean }>) => {
      const index = state.friendListWithDetails.findIndex(item => item._id === action.payload.userId)
      if (index !== -1) {
        state.friendListWithDetails[index].isOnline = action.payload.status
      }
    },
    recentChatSetter: (state, action: PayloadAction<PrivateChat>) => {
      state.recentChat = action.payload
    },
    resetPrivateChatList: (state) => {
      state.List = []
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch profile chat list
      .addCase(getProfileChatList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileChatList.fulfilled, (state, action) => {
        state.loading = false;
        state.List = action.payload?.privateConversationList;
        state.friendListWithDetails = action.payload?.friendListWithDetails;
        state.updateList = "true"
      })
      .addCase(getProfileChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // create private chat conversation
      .addCase(createPrivateChatConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPrivateChatConversation.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.List.find(item => item._id === action.payload._id)) {
          state.List.push(action.payload)
          // console.log(action.payload)
        }
      })
      .addCase(createPrivateChatConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // send message
      .addCase(sendMessagePrivate.pending, (state) => {
        state.messageSendLoading = true;
      })
      .addCase(sendMessagePrivate.fulfilled, (state, action) => {
        state.messageSendLoading = false;
        const index = state.List.findIndex(item => item._id === action.payload.conversationId)
        const duplicateMessage = state.List[index].messages?.find(item => item._id === action.payload._id)
        if (index !== -1 && !duplicateMessage) {
          state.List[index].lastMessageContent = action.payload.content
          state.List[index].updatedAt = action.payload.createdAt
          state.List[index].messages?.push(action.payload)
        }
      })
      .addCase(sendMessagePrivate.rejected, (state, action) => {
        state.messageSendLoading = false;
        state.error = action.payload;
      })
      // get more message
      .addCase(getMoreMessagePrivate.pending, (state) => {
        state.messageLoading = true;
      })
      .addCase(getMoreMessagePrivate.fulfilled, (state, action) => {
        state.messageLoading = false;
        const index = state.List.findIndex(item => item._id === action.payload.conversationId) || 0

        Object.assign(state.List[index], {
          loadAllMessages: action.payload.AllMessagesLoaded,
          page: action.payload.pageCount
        });

        if (index !== -1 && action.payload.AllMessagesLoaded === false) {
          state.List[index].messages = new Array<PrivateMessage>().concat(action.payload.messages, state.List[index].messages!)
        }
        return state
      })
      .addCase(getMoreMessagePrivate.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload;
      })
  }
})

// Action creators are generated for each case reducer function
export const {
  addToPrivateChatList,
  resetPrivateChatList,
  addToPrivateChatListMessage,
  addToPrivateChatListMessageSeen,
  recentChatSetter,
  addToPrivateChatListMessageTyping,
  setUserStatus
} = Private_Chat_Slice.actions

export default Private_Chat_Slice.reducer