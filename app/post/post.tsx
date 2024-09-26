import { Text, Button } from "@/components/skysolo-ui";
import { memo } from "react";
import { View } from "react-native";
import Animated from 'react-native-reanimated';


const PostScreen = memo(function PostScreen({ navigation, route }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Animated.Image
                source={{ uri: 'https://picsum.photos/id/39/200' }}
                style={{ width: 100, height: 100 }}
                sharedTransitionTag="tag"
            />
            <Button onPress={() => { navigation?.navigate("settings") }} variant="outline">
                setting
            </Button>
            <Text variant="heading2">Post Screen</Text>
        </View>
    )
})
export default PostScreen;