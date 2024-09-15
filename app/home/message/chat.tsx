import { View } from "@/components/skysolo-ui";
import { memo, useContext } from "react";
import { NavigationContext, useRoute } from '@react-navigation/native';
import Messages from "@/data/message.json";
import Chat from "@/data/chatlist.json";
import { Navbar, Input, MessageList } from "@/components/message";



const ChatScreen = memo(function ChatScreen() {
    const route = useRoute();
    const navigation = useContext(NavigationContext);


    const PressBack = () => {
        navigation?.goBack()
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Navbar conversation={Chat[1] as any} pressBack={PressBack} />
            <MessageList messages={Messages as any} conversation={Chat[1] as any} />
            <Input conversation={Chat[1] as any} />
        </View>
    )
})
export default ChatScreen;
