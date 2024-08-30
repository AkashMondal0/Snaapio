import { memo } from "react";
import { View } from "@/components/skysolo-ui";
import { Button, Text } from "react-native";


const MessageScreen = memo(function MessageScreen({navigation}:any) {
    return (
        <View style={{
            width: '100%',
            height: '100%',
            flex: 1,
            padding: 20
        }}>
            
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                textAlign: 'center',
                marginTop: 100
            }}>Message Screen</Text>
             <Button title="Go to Home"  onPress={() => {
                navigation?.navigate("home")
            }} />
        </View>
    )
})
export default MessageScreen;