import AppHeader from "@/components/AppHeader";
import { Icon, TouchableOpacity, Text, type IconName } from "@/components/skysolo-ui";
import { configs } from "@/configs";
import { memo } from "react";
import { ScrollView, View } from "react-native";

const SettingScreen = memo(function HomeScreen({ navigation }: any) {
    const settingList = [
        {
            name: "Theme",
            description: "Change the app theme",
            icon: "Palette",
            onPress: () => {
                navigation.navigate(configs.routesNames.settings.theme)
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
            onPress: () => { }
        },
    ]

    return (
        <View style={{
            width: '100%',
            height: '100%',
            flex: 1,
        }}>
            <AppHeader title="Settings" navigation={navigation}
                rightSideComponent={<Icon iconName="Search" size={24} />}
                key={"setting-page-1"} />
            <ScrollView>
                {settingList.map((data, index) => (
                    <Item
                        key={index}
                        data={data}
                    />
                ))}
            </ScrollView>
        </View>
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
                    style={{ fontWeight: "400" }}
                    variant="heading3">
                    {data?.name}
                </Text>
                <Text
                    secondaryColor
                    style={{ fontWeight: "400" }} >
                    {data?.description}
                </Text>
            </View>
        </TouchableOpacity>
    </View>)
}, ((prev, next) => prev.data.name === next.data.name))