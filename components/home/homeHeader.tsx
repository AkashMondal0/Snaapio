import { View } from "react-native"
import { Icon, Separator, Text, AnimatedView } from '@/components/skysolo-ui';
import { NavigationProps } from "@/types";


const HomeHeader = ({ navigation, translateY }: {
    navigation: NavigationProps,
    translateY: any
}) => {
    return <AnimatedView style={[{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1,
        width: '100%',
        elevation: 2,
    }, { transform: [{ translateY }] }]}>
        <View style={{
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
                    navigation.navigate("notification")
                }} />
                <Icon iconName="MessageCircleCode" size={32} onPress={() => {
                    navigation.navigate("message")
                }} />
            </View>
        </View>
        <Separator />
    </AnimatedView>
}

export default HomeHeader