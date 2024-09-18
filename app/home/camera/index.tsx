import { View, Text, Button } from "@/components/skysolo-ui";
import { memo } from "react";


const CameraScreen = memo(function CameraScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Button onPress={() => { navigation?.navigate("message") }}>
                Go to Home
            </Button>
            <Text
                style={{ fontSize: 20 }}
                variant="heading2">Camera Screen</Text>
        </View>
    )
})
export default CameraScreen;