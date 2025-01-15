import AppHeader from "@/components/AppHeader";
import LogOutDialog from "@/components/dialogs/logout";
import { Icon, type IconName } from "@/components/skysolo-ui";
import { Text, ThemedView, TouchableOpacity } from "hyper-native-ui";
import { configs } from "@/configs";
import { logoutApi } from "@/redux-stores/slice/auth/api.service";
import { memo, useCallback, useState } from "react";
import { Linking, ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";

const SettingScreen = memo(function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false)
    const settingList = [
        {
            name: "Appearance",
            description: "Change the appearance of the app",
            icon: "Palette",
            onPress: () => {
                navigation.navigate("settings/theme")
            }
        },
        {
            name: "Edit Profile",
            description: "Edit your profile",
            icon: "Pencil",
            onPress: () => { }
        },
        {
            name: "About",
            description: "About the app",
            icon: "CircleDashed",
            onPress: () => { }
        },
        {
            name: "Help",
            description: "Get help",
            icon: "MonitorSmartphone",
            onPress: () => { }
        },
        {
            name: "Log Out",
            description: "Log out from the app",
            icon: "LogOut",
            onPress: () => {
                setModalVisible(true)
            }
        },
    ]

    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL('https://github.com/AkashMondal0');
        if (supported) {
            await Linking.openURL('https://github.com/AkashMondal0');
        }
    }, []);

    return (
        <ThemedView style={{
            flex: 1,
            width: "100%",
            height: "100%"
        }}>
            <LogOutDialog
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
                confirm={() => {
                    dispatch(logoutApi() as any)
                }} />
            <View style={{
                width: '100%',
                height: '100%',
                flex: 1,
            }}>
                <AppHeader title="Settings" navigation={navigation}
                    rightSideComponent={<Icon iconName="Search" size={24} isButton variant="normal" />}
                    key={"setting-page-1"} />
                <ScrollView keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'>
                    {settingList.map((data, index) => (
                        <Item
                            key={index}
                            data={data}
                        />
                    ))}
                </ScrollView>
            </View>
            <TouchableOpacity onPress={handlePress} style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Text
                    variantColor="secondary"
                    style={{
                        textAlign: "center",
                        paddingRight: 4
                    }}>
                    akashmondal0
                </Text>
                <Icon iconName="ExternalLink" size={20} iconColorVariant="secondary" />
                <Text
                    variantColor="secondary"
                    style={{
                        textAlign: "center",
                        padding: 4
                    }}>| Version {configs.AppDetails.version}
                </Text>
            </TouchableOpacity>
        </ThemedView>
    )
})
export default SettingScreen;


const Item = memo(function Item({
    data,
}: {
    data: {
        name: string,
        description: string,
        icon: IconName | string | any,
        onPress: (id: string) => void,
    },
}) {


    return (<View style={{}}>
        <TouchableOpacity
            onPress={() => { data.onPress(data?.name) }}
            style={{
                width: "100%",
                height: 75,
                padding: 15,
                paddingHorizontal: 20,
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
            }}>
            <Icon iconName={data.icon} size={28} />
            <View>
                <Text
                    style={{ fontWeight: "500" }}
                    variant="H6">
                    {data?.name}
                </Text>
                <Text
                    variantColor="secondary"
                    style={{ fontWeight: "400" }} >
                    {data?.description}
                </Text>
            </View>
        </TouchableOpacity>
    </View>)
}, ((prev, next) => prev.data.name === next.data.name))