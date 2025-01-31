import { memo } from "react";
import { View } from "react-native";
import { Icon } from "@/components/skysolo-ui";
import { NavigationProps } from "@/types";
import { useTheme, Text } from 'hyper-native-ui';


const ProfileNavbar = memo(function HomeScreen({
    navigation,
    username,
    isProfile
}: {
    navigation: NavigationProps,
    username: string
    isProfile: boolean
}) {
    const { currentTheme } = useTheme();

    if (isProfile) {
        return (
            <View style={{
                width: '100%',
                height: 55,
                borderColor: currentTheme?.border,
                borderBottomWidth: 0.8,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6
                }}>
                    <Icon iconName="Lock" size={24} />
                    <Text variant="body1" bold={"semibold"} style={{ fontSize: 24, fontWeight: 'semibold' }}>
                        {username}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    alignItems: 'center',
                }}>
                    <Icon iconName="Plus" size={28} onPress={() => navigation.navigate("Root", { screen: 'create' })} />
                    <Icon iconName="Menu" size={28} onPress={() => navigation.navigate("settings")} />
                </View>
            </View>
        )
    }

    return <View style={{
        width: '100%',
        height: 55,
        borderColor: currentTheme?.border,
        borderBottomWidth: 0.8,
        paddingHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }}>
        <Icon iconName="ChevronLeft" size={34} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 24, fontWeight: "400" }}>{username}</Text>
        <View style={{ width: 40 }} />
    </View>

})
export default ProfileNavbar;