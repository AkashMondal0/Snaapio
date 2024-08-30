import { View } from "@/components/skysolo-ui";
import { memo } from "react";
import { Button, Text } from "react-native";


const CameraScreen = memo(function CameraScreen({navigation}:any) {
    return (
        <View style={{
            width: '100%',
            height: '100%',
            flex: 1,
            padding: 20
        }}>
             <Button title="Go to Camera" onPress={() => {
                navigation?.navigate("message")
            }} />
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                textAlign: 'center',
                marginTop: 100
            }}>Camera Screen</Text>
        </View>
    )
})
export default CameraScreen;