import { View } from "@/components/skysolo-ui";
import { memo, useCallback } from "react";
import { Button, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "@/app/redux/slice/theme";
import { localStorage } from "@/app/lib/LocalStorage";
import { RootState } from "@/app/redux/store";


const ThemeSettingScreen = memo(function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const ThemeColors = useSelector((state: RootState) => state.ThemeState.themeColors)
    const handleChange = useCallback(async (themeName: any) => {
        // console.log("Theme Name", themeName)
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
                {ThemeColors.map((item, index) => {
                        return <TouchableOpacity onPress={() => handleChange(item.name)} key={index}>
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: `hsl(${item.light.primary})`,
                                    borderColor: 'white',
                                    borderWidth: 0.6,
                                    margin: 5,
                                    borderRadius: 15,
                                }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: 12
                                }}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    })}
            </View>
        </View>
    )
})
export default ThemeSettingScreen;