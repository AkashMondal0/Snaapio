import { memo, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "@/redux-stores/slice/theme";
import { localStorage } from "@/lib/LocalStorage";
import { RootState } from "@/redux-stores/store";
import AppHeader from "@/components/AppHeader";


const ThemeSettingScreen = memo(function HomeScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const ThemeColors = useSelector((state: RootState) => state.ThemeState.themeColors)

    const handleChange = useCallback(async (themeName: any) => {
        await localStorage("set", "skysolo-theme-name", themeName)
        dispatch(changeTheme(themeName))
    }, [])
    
    return (
        <View style={{
            width: '100%',
            height: '100%',
            flex: 1,
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
        </View>
    )
})
export default ThemeSettingScreen;