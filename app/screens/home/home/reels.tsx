import { ScrollView } from "@/components/skysolo-ui";
import { memo } from "react";
import { Button, Text } from "react-native";


const ReelsScreen = memo(function ReelsScreen({ navigation }: any) {
    return (
        <ScrollView>
            <Button title="Go to Home" onPress={() => {
                navigation?.navigate("message")
            }} />
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                textAlign: 'center',
                marginTop: 100
            }}>Reels Screen</Text>
        </ScrollView>
    )
})
export default ReelsScreen;