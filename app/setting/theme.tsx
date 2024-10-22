import { memo, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "@/redux-stores/slice/theme";
import { localStorage } from "@/lib/LocalStorage";
import { RootState } from "@/redux-stores/store";
import AppHeader from "@/components/AppHeader";
import { ThemedView } from "@/components/skysolo-ui";


const ThemeSettingScreen = memo(function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const ThemeColors = useSelector((state: RootState) => state.ThemeState.themeColors)

    const handleChange = useCallback(async (themeName: any) => {
        await localStorage("set", "skysolo-theme-name", themeName)
        dispatch(changeTheme(themeName))
    }, [])

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Appearance" titleCenter navigation={navigation} key={"setting-page-2"} />
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 20,
            }}>
                {ThemeColors.map((item, index) => {
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
        </ThemedView>
    )
})
export default ThemeSettingScreen;