import { Text, Button } from "@/components/skysolo-ui";
import { memo } from "react";
import { View } from "react-native";


const ProfileScreen = memo(function ProfileScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Button onPress={() => { navigation?.navigate("setting") }}>
                setting
            </Button>
            <Text variant="heading2">Profile Screen</Text>
        </View>
    )
})
export default ProfileScreen;