import AppHeader from "@/components/AppHeader";
import { memo } from "react";
import { View } from "react-native";


const NotificationScreen = memo(function NotificationScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Notification" navigation={navigation} />
        </View>
    )
})
export default NotificationScreen;