import { graphqlQuery } from "@/lib/GraphqlQuery";
import { findDataInput } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CQ } from "./conversation.queries";

export const fetchConversationsApi = createAsyncThunk(
    'fetchConversationsApi/get',
    async (limitAndOffset: findDataInput, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findAllConversation,
                variables: { graphQlPageQuery: limitAndOffset }
            })
            return res
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchConversationApi = createAsyncThunk(
    'fetchConversationApi/get',
    async (id: string, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findOneConversation,
                variables: { graphQlPageQuery: { id } }
            })
            return res
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchConversationAllMessagesApi = createAsyncThunk(
    'fetchConversationAllMessagesApi/get',
    async (graphQlPageQuery: findDataInput, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findAllMessages,
                variables: { graphQlPageQuery }
            })
            return res
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const CreateConversationApi = createAsyncThunk(
    'CreateConversationApi/post',
    async (memberIds: string[], thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.createConversation,
                variables: {
                    createConversationInput: {
                        isGroup: false,
                        memberIds,
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

//  messages
export const CreateMessageApi = createAsyncThunk(
    'CreateMessageApi/post',
    async (createMessageInput: {
        content: string,
        authorId: string,
        conversationId: string,
        members: string[]
        fileUrl: File[]
    }, thunkAPI) => {
        try {
            let photoUrls: string[] = []
            if (createMessageInput.fileUrl.length > 0) {
                // await Promise.all(createMessageInput.fileUrl.map(async (item, index) => {
                //     thunkAPI.dispatch(showUploadImageInMessage({
                //         currentUploadImgLength: index,
                //     }) as any)
                //     const url = await uploadFirebaseFile(item, createMessageInput.authorId)
                //     if (url) {
                //         photoUrls.push(url)
                //     }
                // }))
            }

            createMessageInput.fileUrl = photoUrls as any
            const res = await graphqlQuery({
                query: CQ.createMessage,
                variables: { createMessageInput }
            })
            return res.createMessage
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const conversationSeenAllMessage = createAsyncThunk(
    'conversationSeenAllMessage/post',
    async ({
        conversationId,
        authorId
    }: {
        conversationId: string
        authorId: string
    }, thunkAPI) => {
        try {
            await graphqlQuery({
                query: CQ.seenMessages,
                variables: { conversationId }
            })
            return { conversationId, authorId }
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);
