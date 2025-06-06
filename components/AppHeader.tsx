import { memo } from "react";
import { StatusBar, View, ViewProps } from "react-native";
import { Icon } from "@/components/skysolo-ui";
import { useTheme } from 'hyper-native-ui';
import { Text } from "hyper-native-ui";
import { useNavigation } from "@react-navigation/native";


const AppHeader = memo(function HomeScreen({
    title = "user",
    titleCenter = false,
    rightSideComponent,
    containerStyle,
    backCallback
}: {
    title: string
    titleCenter?: boolean
    rightSideComponent?: React.ReactNode
    containerStyle?: ViewProps["style"]
    backCallback?: () => void
}) {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();

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
                justifyContent: "space-between",
                marginTop: StatusBar.currentHeight
            }, containerStyle]}>
                <Icon iconName="ArrowLeft"
                    size={28}
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack()
                            backCallback && backCallback()
                        } else {
                            navigation.navigate("HomeTabs")
                        }
                    }} />
                <Text variant="H5" style={{
                    fontSize: 22,
                    fontWeight: "600"
                }}>
                    {title}
                </Text>
                <View style={{
                    width: 28,
                    marginRight: 6
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
            marginTop: StatusBar.currentHeight,
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
                <Text variant="H5" style={{
                    fontSize: 22,
                    fontWeight: "600"
                }}>
                    {title}
                </Text>
            </View>
            <View style={{ width: 28, marginRight: 6 }}>
                {rightSideComponent}
            </View>
        </View>
    )
})
export default AppHeader;