import { ScrollView } from "@/components/skysolo-ui";
import { memo } from "react";
import { Button, Text } from "react-native";


const ProfileScreen = memo(function ProfileScreen({ navigation }: any) {
    return (
        <ScrollView>
            <Button title="Go to Setting" onPress={() => {
                navigation?.navigate("setting")
            }} />
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                textAlign: 'center',
                marginTop: 100
            }}>Profile Screen</Text>
        </ScrollView>
    )
})
export default ProfileScreen;