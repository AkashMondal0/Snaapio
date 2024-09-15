import { View } from "@/components/skysolo-ui";
import { memo } from "react";
import { useRoute } from '@react-navigation/native';

const ChatScreen = memo(function ChatScreen() {
    const route = useRoute();

    console.log(route.params)
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
        </View>
    )
})
export default ChatScreen;