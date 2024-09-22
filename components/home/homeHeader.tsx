import { View } from "react-native"
import { Icon, Text } from '@/components/skysolo-ui';
import { NavigationProps } from "@/types";
import { memo } from "react";
import { configs } from "@/configs";


const HomeHeader = memo(function HomeHeader({ navigation }: { navigation: NavigationProps }) {
    return <View style={{
        width: '100%',
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    }}>
        <Text variant="heading2" style={{
            fontWeight: "700",
            padding: "3%",
            paddingVertical: 14
        }}>SkyLight</Text>
        <View style={{
            flexDirection: "row",
            gap: 14,
            padding: 10,
            alignItems: "center",
            marginHorizontal: 10
        }}>
            <Icon iconName="Heart" size={30} onPress={() => {
                navigation.navigate("Root", { screen: "message" })
            }} />
            <Icon iconName="Send" size={30} onPress={() => {
                navigation.navigate("Root", { screen: "message" })
            }} />
        </View>
    </View>
}, () => true)

export default HomeHeader