import { Text, ThemedView } from "hyper-native-ui";
import { memo } from "react";

const ReelsScreen = memo(function ReelsScreen({ navigation }: any) {
    return (
        <ThemedView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Text variant="H4">Reels Screen</Text>
        </ThemedView>
    )
})
export default ReelsScreen;