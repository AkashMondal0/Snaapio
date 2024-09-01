import { View, Text, Button } from "@/components/skysolo-ui";
import { memo } from "react";


const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Button
                variant="danger"
                size="small"
                onPress={() => { navigation?.navigate("message") }}>
                Go to Home
            </Button>
            <Button
                size="large"
                variant="warning"
                onPress={() => { navigation?.navigate("message") }}>
                Go to Home
            </Button>
            <Button
                variant="secondary"
                onPress={() => { navigation?.navigate("message") }}>
                Go to Home
            </Button>
            <Button
                onPress={() => { navigation?.navigate("message") }}>
                Go to Home
            </Button>
            <Text variant="heading2">Feed Screen</Text>
        </View>
    )
})
export default FeedsScreen;