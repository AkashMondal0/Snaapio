import { configs } from "@/configs";
import { SecureStorage } from "@/lib/SecureStore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { resetAccountState } from "../account";
import { resetConversationState } from "../conversation";
import { resetPostState } from "../post";
import { resetProfileState } from "../profile";
import { resetUserState } from "../users";
import { resetNotificationState } from "../notification";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { AQ } from "../account/account.queries";
import { uploadFileToSupabase } from "@/lib/SupaBase-uploadFile";
import { ImageCompressor } from "@/lib/RN-ImageCompressor";
import { Asset } from "expo-media-library";
type UpdateProfile = {
    updateUsersInput?: {
        username?: string
        email?: string
        name?: string
        bio?: string
        website?: string[]
        profilePicture?: string
    },
    file?: Asset,
    profileId: string
}
export const loginApi = async ({
    email,
    password,
}: {
    email: string,
    password: string,
}) => {
    return await fetch(`${configs.serverApi.baseUrl}/auth/login`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        redirect: "follow",
        body: JSON.stringify({
            email,
            password
        }),
        credentials: "include"
    })
        .then(async (res) => {
            const _data = await res.json()
            if (!res.ok) {
                return {
                    data: _data,
                    message: _data.message,
                    code: 0
                }
            }
            SecureStorage("set", configs.sessionName, JSON.stringify(_data.data))
            return {
                data: _data,
                message: "Login Successful",
                code: 1
            };
        })
        .catch((e) => {
            return {
                data: e,
                message: e.message,
                code: 0
            }
        });
}

export const registerApi = async ({
    email,
    password,
    name,
    username
}: {
    email: string,
    password: string,
    name: string,
    username: string
}) => {

    return await fetch(`${configs.serverApi.baseUrl}/auth/register`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        redirect: "follow",
        body: JSON.stringify({
            email,
            password,
            name,
            username
        }),
        credentials: "include"
    })
        .then(async (res) => {
            const _data = await res.json()
            if (!res.ok) {
                return {
                    data: _data,
                    message: _data.message,
                    code: 0
                }
            }
            SecureStorage("set", configs.sessionName, JSON.stringify(_data.data))
            return {
                data: _data,
                message: "Register Successful",
                code: 1
            };
        })
        .catch((e) => {
            return {
                data: e,
                message: e.message,
                code: 0
            }
        });
}

export const logoutApi = createAsyncThunk(
    'fetchConversationApi/get',
    async (_, thunkAPI) => {
        try {
            await SecureStorage("remove", configs.sessionName)
            thunkAPI.dispatch(resetAccountState())
            thunkAPI.dispatch(resetConversationState())
            thunkAPI.dispatch(resetPostState())
            thunkAPI.dispatch(resetProfileState())
            thunkAPI.dispatch(resetUserState())
            thunkAPI.dispatch(resetNotificationState())
            await fetch(`${configs.serverApi.baseUrl}/auth/logout`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                redirect: "follow",
                credentials: "include",
                body: JSON.stringify({}),
            })
            return true
        } catch (error) {
            console.error("Error in logging out", error)
            return false
        }
    }
);

export const profileUpdateApi = createAsyncThunk(
    'profileUpdateApi/post',
    async (data: UpdateProfile, thunkApi) => {
        const { file, profileId, updateUsersInput } = data
        try {
            let data;
            if (file) {
                const CImg = await ImageCompressor({
                    image: file.uri,
                    quality: "low"
                })
                const url = await uploadFileToSupabase(CImg, "image/jpeg", profileId);
                if (!url) {
                    return ""
                }
                const res = await graphqlQuery({
                    query: AQ.updateUserProfile,
                    variables: {
                        updateUsersInput: { profilePicture: url }
                    }
                })
                data = res
            }
            else {
                const res = await graphqlQuery({
                    query: AQ.updateUserProfile,
                    variables: {
                        updateUsersInput
                    }
                })
                data = res
            }
            SecureStorage("set", configs.sessionName, JSON.stringify(data))
            return data
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);