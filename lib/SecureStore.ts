import * as SecureStore from 'expo-secure-store';

const getSecureStorage = async <T>(key: string, dataType?: "string" | "json"): Promise<T | null> => {
    if (!key) {
        console.error('key not found');
        return null
    }
    try {
        const value = await SecureStore.getItemAsync(key);
        if (!value) return null;
        if (dataType === "string") {
            return value as any
        }
        return JSON.parse(value);
    } catch (err) {
        console.error("Error in get secure function", err)
        return null
    }
}

const setSecureStorage = async (key: string, value: string): Promise<boolean> => {
    if (!key || !value) {
        console.error('key or value not found');
        return false
    }
    try {
        await SecureStore.setItemAsync(key, value);
        return true
    } catch (err) {
        console.error("Error in set secure function", err)
        return false
    }
}

const deleteSecureStorage = async (key: string): Promise<boolean> => {
    try {
        await SecureStore.deleteItemAsync(key);
        return true
    } catch (err) {
        console.error("Error in delete secure function", err)
        return false
    }
}

export { getSecureStorage, setSecureStorage, deleteSecureStorage }