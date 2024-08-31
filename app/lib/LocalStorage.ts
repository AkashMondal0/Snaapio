import AsyncStorage from "@react-native-async-storage/async-storage"

const localStorage = async (method: "get" | "set" | "remove", key: string, setItemValue?: string) => {
    try {
        if (method === "get") {
            return await AsyncStorage.getItem(key)
        }
        if (method === "set") {
            if (!setItemValue) throw new Error("setItemValue is required")
            return await AsyncStorage.setItem(key, setItemValue)
        }
        if (method === "remove") {
            return await AsyncStorage.removeItem(key)
        }
        else {
            throw new Error("Invalid method")
        }
    } catch (err) {
        console.error("Error in saving theme from redux async storage", err)
        throw new Error("Error in saving theme from redux async storage")
    }
}

export { localStorage }