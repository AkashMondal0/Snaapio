import React from "react";
import { memo, useCallback } from "react";
import { useTheme, themeColors, Text, Dropdown } from "hyper-native-ui";
import { TouchableOpacity, View } from "react-native";
import AppHeader from "@/components/AppHeader";
import { setThemeName, setThemeSchema } from "@/redux-stores/slice/auth";
import { useDispatch } from "react-redux";

const ThemeSettingScreen = memo(function HomeScreen() {
    const { changeTheme } = useTheme();
    const dispatch = useDispatch();
    const handleChange = useCallback(async (themeName: any) => {
        try {
            changeTheme(themeName);
            dispatch(setThemeName(themeName))
        } catch (error) {
            console.error("Error in setting theme", error);
        }
    }, [])

    return (
        <View style={{
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
        </View>
    )
})
export default ThemeSettingScreen;


const SwitchDarkDropDownComponent = () => {
    const { toggleTheme, currentColorScheme } = useTheme();
    const dispatch = useDispatch();

    const items = [
        { label: 'System', value: "system" },
        { label: 'Dark', value: "dark" },
        { label: 'Light', value: "light" },
    ];

    const onSelect = (item: any) => {
        if (currentColorScheme !== item.value) {
            toggleTheme(item.value)
            dispatch(setThemeSchema(item.value))
        }
    }
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
};