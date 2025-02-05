import React from "react";
import { memo, useCallback } from "react";
import { ThemedView, useTheme, themeColors, Text, Dropdown } from "hyper-native-ui";
import { TouchableOpacity, View } from "react-native";
import AppHeader from "@/components/AppHeader";
import { configs } from "@/configs";
import { setSecureStorage } from "@/lib/SecureStore";

const ThemeSettingScreen = memo(function HomeScreen() {
    const { changeTheme } = useTheme();
    const handleChange = useCallback(async (themeName: any) => {
        try {
            await setSecureStorage(configs.themeName, themeName);
            changeTheme(themeName);
        } catch (error) {
            console.error("Error in setting theme", error);
        }
    }, [])

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader
                title="Appearance"
                titleCenter
                key={"setting-page-2"} />
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 20,
            }}>
                {themeColors.map((item, index) => {
                    return <TouchableOpacity onPress={() => handleChange(item.name)} key={index}>
                        <View
                            style={{
                                width: 50,
                                height: 60,
                                backgroundColor: item.light.primary,
                                borderColor: item.light.border,
                                borderWidth: 0.8,
                                margin: 5,
                                borderRadius: 15,
                            }}>
                        </View>
                    </TouchableOpacity>
                })}
            </View>
            {/* <SwitchDarkComponent /> */}
            <SwitchDarkDropDownComponent />
        </ThemedView>
    )
})
export default ThemeSettingScreen;


const SwitchDarkDropDownComponent = () => {
    const { toggleTheme, currentColorScheme } = useTheme();
    const items = [
        { label: 'System', value: "system" },
        { label: 'Dark', value: "dark" },
        { label: 'Light', value: "light" },
    ];

    const onSelect = (item: any) => currentColorScheme !== item.value && toggleTheme(item.value)
    return <>
        <View style={{
            width: "95%",
            height: 75,
            padding: 15,
            paddingHorizontal: 20,
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 14,
                    alignItems: "center"
                }}>
                <Text style={{ fontWeight: "600" }} variant="H6">
                    Change theme
                </Text>
            </View>
            <Dropdown data={items} placeholder={currentColorScheme} onSelect={onSelect} />
        </View>
    </>
}
// const SwitchDarkComponent = () => {
//     const { toggleTheme, themeScheme, currentColorScheme } = useTheme();
//     const [state, setState] = useState(themeScheme === "dark");
//     const [state2, setState2] = useState(currentColorScheme === "system");

//     const onValueChange = useCallback(async (value: boolean) => {
//         try {
//             const condition = value ? "dark" : "light";
//             await setSecureStorage(configs.themeSchema, condition);
//             toggleTheme(condition);
//         } catch (error) {
//             console.error("Error in setting theme", error);
//         } finally {
//             setState(value);
//         }
//     }, []);

//     const onSTChange = useCallback(async (value: boolean) => {
//         try {
//             if (value) {
//                 await setSecureStorage(configs.themeSchema, "system");
//                 toggleTheme("system");
//             } else {
//                 await setSecureStorage(configs.themeSchema, themeScheme);
//                 toggleTheme(themeScheme);
//             }
//         } catch (error) {
//             console.error("Error in setting theme", error);
//         } finally {
//             setState2(value);
//         }
//     }, [themeScheme]);

//     return (<>
//         <Text center variant="H4" disabled={state2}>
//             {currentColorScheme}
//         </Text>
//         <View style={{
//             width: "100%",
//             height: 75,
//             padding: 15,
//             paddingHorizontal: 20,
//             display: 'flex',
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//         }}>
//             <View
//                 style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     gap: 14,
//                     alignItems: "center"
//                 }}>
//                 <Icon iconName={"Moon"} size={36} disabled={state2} />
//                 <Text style={{ fontWeight: "600" }} variant="H6" disabled={state2}>
//                     Switch To Dark
//                 </Text>
//             </View>
//             <Switch onValueChange={onValueChange} isChecked={state} size="medium" disabled={state2} />
//         </View>
//         <View style={{
//             width: "100%",
//             height: 75,
//             padding: 15,
//             paddingHorizontal: 20,
//             display: 'flex',
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//         }}>
//             <View
//                 style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     gap: 14,
//                     alignItems: "center"
//                 }}>
//                 <Icon iconName={"MonitorDot"} size={36} />
//                 <Text style={{ fontWeight: "600" }} variant="H6">
//                     System Mode
//                 </Text>
//             </View>
//             <Switch onValueChange={onSTChange} isChecked={state2} size="medium" />
//         </View>
//     </>);
// }