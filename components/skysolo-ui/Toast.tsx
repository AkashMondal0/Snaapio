import Toast from "react-native-toast-message";

const SkySoloToast = {
    showToast: ({
        type = 'info',
        text1 = 'Hello',
        text2 = 'This is some something 👋'
    }: {
        type?: 'success' | 'error' | 'info',
        text1?: string,
        text2?: string
    }) => {
        Toast.show({
            type,
            text1,
            text2
        })
    }
}

export default SkySoloToast;