import { memo } from "react";
import { View } from "react-native";
import { Icon, Text } from "@/components/skysolo-ui"
import { NavigationProps } from "@/types";


const ProfileHeader = memo(function HomeScreen({
    navigation,
    username,
    isProfile
}: {
    navigation: NavigationProps,
    username?: string
    isProfile?: boolean
}) {

    return <View style={{
        width: '100%',
        height: 500,
        borderWidth: 1,
        borderColor: 'black',
    }}>
        <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            padding: 10
        }}>{`username`}</Text>
    </View>

})
export default ProfileHeader;