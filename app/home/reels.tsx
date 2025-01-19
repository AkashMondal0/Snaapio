import { Button, Text, ThemedView } from "hyper-native-ui";
import { memo } from "react";
import { Appearance } from "react-native";

const ReelsScreen = memo(function ReelsScreen({ navigation }: any) {
    return (
        <ThemedView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Text variant="H4">Reels Screen {Appearance.getColorScheme()}</Text>
            <Button onPress={()=>{
                Appearance.setColorScheme("dark")
            }}>
                change theme
            </Button>
            <Button onPress={()=>{
                Appearance.setColorScheme("light")
            }}>
                change theme light
            </Button>
        </ThemedView>
    )
})
export default ReelsScreen;