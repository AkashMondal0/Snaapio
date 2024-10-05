import { Text } from "@/components/skysolo-ui";
import { memo } from "react";
import { View } from "react-native";

const ReelsScreen = memo(function ReelsScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Text variant="heading2">Reels Screen</Text>
        </View>
    )
})
export default ReelsScreen;