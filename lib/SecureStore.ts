import * as SecureStore from 'expo-secure-store';

const SecureStorage = async (method: "get" | "set" | "remove", key: string, setItemValue?: string) => {
    try {
        if (method === "get") {
            const value = await SecureStore.getItemAsync(key);
            if (!value) return null
            return JSON.parse(value)
        }
        if (method === "set") {
            if (!setItemValue) throw new Error("setItemValue is required")
            return await SecureStore.setItemAsync(key, setItemValue);
        }
        if (method === "remove") {
            return await SecureStore.deleteItemAsync(key);
        }
        else {
            throw new Error("Invalid method")
        }
    } catch (err) {
        console.error("Error in saving theme from redux async storage", err)
        // throw new Error("Error in saving theme from redux async storage")
    }
}

const getSecureStorage = async <T>(key: string): Promise<T | null> => {
    try {
        const value = await SecureStore.getItemAsync(key);
        if (!value) return null
        return JSON.parse(value)
    } catch (err) {
        console.error("Error in getting theme from redux async storage", err)
        return null
    }
}

export { SecureStorage, getSecureStorage }