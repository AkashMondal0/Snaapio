import { View } from "@/components/skysolo-ui";
import { memo, useCallback } from "react";
import { Button, Text, TouchableOpacity } from "react-native";
import Themes from "@/components/skysolo-ui/colors/skysolo.color.json";
import { useDispatch } from "react-redux";
import { changeTheme } from "@/app/redux/slice/theme";
import { ThemeNames } from "@/components/skysolo-ui/colors";
import { localStorage } from "@/app/lib/LocalStorage";


const ThemeSettingScreen = memo(function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const handleChange = useCallback(async (themeName: ThemeNames) => {
        await localStorage("set", "skysolo-theme-name", themeName)
        dispatch(changeTheme(themeName))
    }, [])
    return (
        <View style={{
            width: '100%',
            height: '100%',
            flex: 1,
            padding: 20
        }}>
            <Button title="Go to Home" onPress={() => {
                navigation?.navigate("home_2", { screen: "setting" })
            }} />
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'red',
                textAlign: 'center',
                marginTop: 100
            }}>ThemeSetting Screen</Text>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 20
            }}>
                {Object.entries(Themes)
                    .map(([key, value]) => ({ key, value }))
                    .map((item, index) => {
                        return <TouchableOpacity onPress={() => handleChange(item.key as ThemeNames)} key={index}>
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: `hsl(${item.value.light.primary})`,
                                    borderColor: 'white',
                                    borderWidth: 0.6,
                                    margin: 5,
                                    borderRadius: 15,
                                }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: 12
                                }}>{item.key}</Text>
                            </View>
                        </TouchableOpacity>
                    })}
            </View>
        </View>
    )
})
export default ThemeSettingScreen;