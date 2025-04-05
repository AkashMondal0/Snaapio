import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { configs } from "@/configs";
import { getSecureStorage } from "@/lib/SecureStore";
import { Asset } from "expo-media-library";
import { Session } from "@/types";

export const uploadPost = async (data: {
    files: Asset[]
}): Promise<any | null> => {
    if (!data?.files || !Array.isArray(data.files)) {
        console.error("Invalid data.files:", data.files);
        return;
    }

    const formData = new FormData();

    const filePromises = data.files.map(async (file, index) => {
        if (!file?.uri) {
            console.error(`File at index ${index} is missing a URI:`, file);
            return null;
        }

        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        if (!fileInfo.exists) {
            console.error(`File not found: ${file.uri}`);
            return null;
        }

        return {
            uri: file.uri,
            type: file.mediaType === "photo" ? "image/jpeg" : "video/mp4",
            name: file.filename || `upload_${Date.now()}.jpg`,
        };
    });

    const files = (await Promise.all(filePromises)).filter(Boolean); // Remove `null` values

    files.forEach((file) => {
        formData.append("files", file as any); // Change to "files" if needed
    });

    try {
        const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
        if (!BearerToken?.accessToken) {
            console.error("Error retrieving token from SecureStorage")
            ToastAndroid.showWithGravity("Internal Error", ToastAndroid.SHORT, ToastAndroid.CENTER);
            return;
        };
        const response = await fetch(`${configs.serverApi.baseUrl}/image/upload_variant`, {
            method: "POST",
            body: formData,
            credentials: "include",
            cache: 'no-cache',
            headers: {
                'Authorization': `${BearerToken.accessToken}`,
            },
        });
        if (!response.ok) {
            const result = await response.json();
            console.error("Upload failed:", result);
            return null;
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

// export const uploadOneFile = async (data: {
//     file: Asset
// }): Promise<any | null> => {
//     if (!data?.file || !Array.isArray(data.file)) {
//         console.error("Invalid data.files:", data.file);
//         return;
//     }

//     const formData = new FormData();

//     const fileInfo = await FileSystem.getInfoAsync(data?.file.uri);
//     if (!fileInfo.exists) {
//         console.error(`File not found: ${data?.file}`);
//         return null;
//     }

//     formData.append("files", {
//         uri: data?.file,
//         type: "image/jpeg",
//         name: `avatar_${Date.now()}.jpg`,
//     } as any); // Change to "files" if needed

//     try {
//         const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
//         if (!BearerToken?.accessToken) {
//             console.error("Error retrieving token from SecureStorage")
//             ToastAndroid.showWithGravity("Internal Error", ToastAndroid.SHORT, ToastAndroid.CENTER);
//             return;
//         };
//         const response = await fetch(`${configs.serverApi.baseUrl}/image/upload_variant`, {
//             method: "POST",
//             body: formData,
//             credentials: "include",
//             cache: 'no-cache',
//             headers: {
//                 'Authorization': `${BearerToken.accessToken}`,
//             },
//         });
//         if (!response.ok) {
//             const result = await response.json();
//             console.error("Upload failed:", result);
//             return null;
//         }
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         console.error("Upload failed:", error);
//         return null;
//     }
// };