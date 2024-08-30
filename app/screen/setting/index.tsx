import { View } from "@/components/skysolo-ui";
import { memo } from "react";
import { Button, Text } from "react-native";


const SettingScreen = memo(function HomeScreen({ navigation }: any) {
    return (
        <View style={{
            width: '100%',
            height: '100%',
            flex: 1,
            padding: 20
        }}>
            <Button title="Go to Theme" onPress={() => {
                // navigation?.navigate("")
                navigation?.navigate("settingTheme")
            }} />
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                textAlign: 'center',
                marginTop: 100
            }}>Setting Screen</Text>
        </View>
    )
})
export default SettingScreen;