import { configs } from "@/configs";
import { deleteSecureStorage, getSecureStorage, setSecureStorage } from "@/lib/SecureStore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { resetAccountState } from "../account";
import { resetConversationState } from "../conversation";
import { graphqlQuery } from "@/lib/GraphqlQuery";
import { AQ } from "../account/account.queries";
import { Session, UploadFileRespond } from "@/types";
import { Asset } from "expo-media-library";
import { uploadPost } from "@/lib/uploadFiles";

export const loginApi = createAsyncThunk(
    'loginApi/post',
    async ({ email, password }: { email: string, password: string }, thunkAPI) => {
        try {
            const response = await fetch(`${configs.serverApi.baseUrl}/auth/login`, {
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
            });

            if (!response.ok) {
                const data = await response.json();
                return thunkAPI.rejectWithValue({
                    message: data.message
                });
            }

            const data = await response.json();
            setSecureStorage(configs.sessionName, JSON.stringify(data))
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message: "Internal Login Error"
            });
        }
    }
);

export const registerApi = createAsyncThunk(
    'registerApi/post',
    async ({
        email,
        password,
        name,
        username
    }: {
        email: string,
        password: string,
        name: string,
        username: string
    }, thunkAPI) => {
        try {
            const response = await fetch(`${configs.serverApi.baseUrl}/auth/register`, {
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
            });

            if (!response.ok) {
                const data = await response.json();
                return thunkAPI.rejectWithValue({
                    message: data.message
                });
            }

            const data = await response.json();
            setSecureStorage(configs.sessionName, JSON.stringify(data))
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message: "Internal Login Error"
            });
        }
    }
);

export const logoutApi = createAsyncThunk(
    'logout/get',
    async (_, thunkAPI) => {
        try {
            await deleteSecureStorage(configs.sessionName);
            thunkAPI.dispatch(resetAccountState());
            thunkAPI.dispatch(resetConversationState());
            return true;
        } catch (error) {
            console.error("Error in logging out", error);
            return false;
        }
    }
);

export const profileUpdateApi = createAsyncThunk(
    'profileUpdateApi/post',
    async (data: {
        updateUsersInput?: {
            username?: string
            email?: string
            name?: string
            bio?: string
            website?: string[]
            profilePicture?: string
        },
        fileUrl?: Asset[],
        profileId: string
    }, thunkApi) => {
        const { fileUrl, profileId, ...updateUsersInput } = data;
        try {
            let _data; // to store the response
            let newProfileImage;
            if (fileUrl) {
                const imgUrls = await uploadPost({ files: fileUrl }) as UploadFileRespond[]
                if (!imgUrls) {
                    return thunkApi.rejectWithValue({
                        message: "Server Error"
                    });
                }
                // Update the user profile with the new image
                const res = await graphqlQuery({
                    query: AQ.updateUserProfile,
                    variables: {
                        updateUsersInput: { profilePicture: imgUrls[0].square, fileUrl: imgUrls }
                    }
                });
                _data = res;
                newProfileImage = imgUrls[0].square
            }
            // Update only the user profile with the new details
            else {
                const res = await graphqlQuery({
                    query: AQ.updateUserProfile,
                    variables: updateUsersInput
                });
                _data = res;
            }
            // Update the session with the new details
            const session = await getSecureStorage<Session["user"]>(configs.sessionName);
            const newUser = {
                ...session,
                ...updateUsersInput
            }
            await setSecureStorage(configs.sessionName, JSON.stringify(newUser));
            return {
                bio: data.updateUsersInput?.bio,
                name: data.updateUsersInput?.name,
                username: data.updateUsersInput?.username,
                email: data.updateUsersInput?.email,
                profilePicture: newProfileImage,
            };
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            });
        }
    }
);