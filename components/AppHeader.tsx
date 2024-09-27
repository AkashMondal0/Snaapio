import { memo } from "react";
import { View, ViewProps } from "react-native";
import { Icon, Text } from "@/components/skysolo-ui"
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";


const AppHeader = memo(function HomeScreen({
    navigation,
    title,
    titleCenter = false,
    rightSideComponent,
    containerStyle
}: {
    navigation: any
    title: string
    titleCenter?: boolean
    rightSideComponent?: React.ReactNode
    containerStyle?: ViewProps["style"]
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    if (titleCenter) {
        return (
            <View style={[{
                width: '100%',
                height: 55,
                borderBottomWidth: 0.8,
                borderColor: currentTheme?.border,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "space-between"
            }, containerStyle]}>
                <Icon iconName="ArrowLeft"
                    size={28}
                    onPress={() => {
                        navigation.goBack()
                    }} />
                <Text variant="heading3" style={{
                    fontSize: 22,
                    fontWeight: "600"
                }}>
                    {title}
                </Text>
                <View style={{
                    width: 28,
                }}>
                    {rightSideComponent}
                </View>
            </View>
        )
    }

    return (
        <View style={[{
            width: '100%',
            height: 55,
            borderColor: currentTheme?.border,
            borderBottomWidth: 0.8,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }, containerStyle]}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12
            }}>
                <Icon iconName="ArrowLeft"
                    size={28}
                    onPress={() => {
                        navigation.goBack()
                    }} />
                <Text variant="heading3" style={{
                    fontSize: 22,
                    fontWeight: "600"
                }}>
                    {title}
                </Text>
            </View>
            <View style={{ width: 28 }}>
                {rightSideComponent}
            </View>
        </View>
    )
})
export default AppHeader;