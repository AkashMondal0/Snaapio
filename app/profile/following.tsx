import AppHeader from "@/components/AppHeader";
import { memo } from "react";
import { View } from "react-native";


const FollowingScreen = memo(function FollowingScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Following" navigation={navigation} />
        </View>
    )
})
export default FollowingScreen;