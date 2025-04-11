import { memo } from "react";
import { View } from "react-native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { useTheme, Text } from 'hyper-native-ui';
import { useNavigation } from "@react-navigation/native";


const ProfileNavbar = memo(function HomeScreen({
    username,
    isProfile,
    isVerified
}: {
    username: string
    isProfile: boolean
    isVerified: boolean | null | undefined
}) {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();

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
                    gap: 6,
                    flex: 1, // Ensure the username text doesn't overflow
                }}>
                    <Icon iconName="Lock" size={24} />
                    <Text
                        variant="body1"
                        bold={"semibold"}
                        style={{ fontSize: 24, fontWeight: 'semibold', flexShrink: 1 }}
                        numberOfLines={1}>
                        {username}
                    </Text>
                    <Avatar
                        size={24}
                        style={{
                            backgroundColor: "transparent",
                            display: isVerified ? 'flex' : 'none',
                        }}
                        serverImage={false}
                        touchableOpacity={false}
                        source={require('../../assets/images/verified.png')}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    alignItems: 'center',
                }}>
                    <Icon iconName="Menu" size={28} onPress={() => navigation.navigate("Settings")} />
                </View>
            </View>
        );
    };

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
        <Icon iconName="ChevronLeft" size={34} onPress={() => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate("HomeTabs");
            }
        }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 24, fontWeight: "400" }}>{username}</Text>
            <Avatar
                size={24}
                style={{
                    backgroundColor: "transparent",
                    display: isVerified ? 'flex' : 'none'
                }}
                serverImage={false}
                touchableOpacity={false}
                source={require('../../assets/images/verified.png')}
            />
        </View>
        <View style={{ width: 40 }} />
    </View>;

}, (prevProps, nextProps) => {
    return prevProps.username === nextProps.username && prevProps.isProfile === nextProps.isProfile && prevProps.isVerified === nextProps.isVerified
});
export default ProfileNavbar;