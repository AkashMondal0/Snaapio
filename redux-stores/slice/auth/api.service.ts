import { configs } from "@/configs";
import { SecureStorage } from "@/lib/SecureStore";

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
            if (!res.ok) {
                const error = await res.json()
                return {
                    data: error,
                    message: error.message,
                    code: 0
                }
            }
            return {
                data: await res.json(),
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
            if (!res.ok) {
                const error = await res.json()
                throw new Error(`${error.message}`);
            }
            return {
                data: await res.json(),
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

export const logoutApi = async () => {
    try {
        await SecureStorage("remove", configs.sessionName)
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