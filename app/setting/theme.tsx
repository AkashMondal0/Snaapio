import { memo, useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "@/redux-stores/slice/theme";
import { localStorage } from "@/lib/LocalStorage";
import { RootState } from "@/redux-stores/store";
import AppHeader from "@/components/AppHeader";
import { Icon } from "@/components/skysolo-ui";


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
        }}>
            <AppHeader title="Themes" navigation={navigation} key={"setting-page-1"} />
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 20
            }}>
                <ScrollView horizontal>
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
                            </View>
                        </TouchableOpacity>
                    })}
                </ScrollView>
            </View>
        </View>
    )
})
export default ThemeSettingScreen;