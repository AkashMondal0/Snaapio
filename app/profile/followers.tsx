import AppHeader from "@/components/AppHeader";
import { memo } from "react";
import { View } from "react-native";


const FollowersScreen = memo(function FollowersScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Followers" navigation={navigation} />
        </View>
    )
})
export default FollowersScreen;