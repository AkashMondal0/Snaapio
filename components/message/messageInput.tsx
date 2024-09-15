import { Icon, Input } from "@/components/skysolo-ui";
import { memo } from "react";
import { Conversation } from "@/types";
import { View } from "react-native";

const ChatScreenInput = memo(function ChatScreenInput({
    conversation
}: {
    conversation: Conversation
}) {


    return (
        <View style={{
            width: "100%",
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
            paddingHorizontal: 6,
        }}>
            <Input placeholder="Type a message"
                secondaryColor
                multiline
                style={{
                    width: "84%",
                    height: "100%",
                    borderRadius: 18,
                    borderWidth: 0,
                    maxHeight: 100,
                }} />
            <Icon iconName={"Send"} isButton size={26} style={{
                padding: "4%",
                height: 50,
            }} />
        </View>
    )
})
export default ChatScreenInput;