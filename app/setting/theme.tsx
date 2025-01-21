import React from "react";
import { memo, useCallback, useEffect, useState } from "react";
import { ThemedView, useTheme, themeColors, Switch, Text } from "hyper-native-ui";
import { TouchableOpacity, View } from "react-native";
import { localStorage } from "@/lib/LocalStorage";
import AppHeader from "@/components/AppHeader";
import { Icon } from "@/components/skysolo-ui";
import { configs } from "@/configs";

const ThemeSettingScreen = memo(function HomeScreen({ navigation }: any) {
    const { changeTheme } = useTheme();

    const handleChange = useCallback(async (themeName: any) => {
        try {
            await localStorage("set", configs.themeName, themeName);
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
                navigation={navigation}
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
            <SwitchDarkComponent />
        </ThemedView>
    )
})
export default ThemeSettingScreen;


const SwitchDarkComponent = () => {
    const { toggleTheme, themeScheme, currentColorScheme } = useTheme();
    const [state, setState] = useState(themeScheme === "dark");
    const [state2, setState2] = useState(currentColorScheme === "system");

    const onValueChange = useCallback(async (value: boolean) => {
        try {
            const condition = value ? "dark" : "light";
            await localStorage("set", configs.themeSchema, condition);
            toggleTheme(condition);
        } catch (error) {
            console.error("Error in setting theme", error);
        } finally {
            setState(value);
        }
    }, []);

    const onSTChange = useCallback(async (value: boolean) => {
        try {
            if (value) {
                await localStorage("set", configs.themeSchema, "system");
                toggleTheme("system")
            } else {
                await localStorage("set", configs.themeSchema, themeScheme);
                toggleTheme(themeScheme)
            }
        } catch (error) {
            console.error("Error in setting theme", error);
        } finally {
            setState2(value);
        }
    }, [themeScheme]);

    useEffect(() => {
        setState(themeScheme === "dark")
    }, [themeScheme])

    return (<>
        <Text center variant="H4" disabled={state2}>
            {currentColorScheme}
        </Text>
        <View style={{
            width: "100%",
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
                <Icon iconName={"Moon"} size={36} disabled={state2} />
                <Text style={{ fontWeight: "600" }} variant="H6" disabled={state2}>
                    Switch To Dark
                </Text>
            </View>
            <Switch onValueChange={onValueChange} isChecked={state} size="medium" disabled={state2} />
        </View>
        <View style={{
            width: "100%",
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
                <Icon iconName={"MonitorDot"} size={36} />
                <Text style={{ fontWeight: "600" }} variant="H6">
                    System Mode
                </Text>
            </View>
            <Switch onValueChange={onSTChange} isChecked={state2} size="medium" />
        </View>
    </>)
}