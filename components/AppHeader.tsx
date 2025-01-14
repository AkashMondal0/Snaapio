import { memo } from "react";
import { View, ViewProps } from "react-native";
import { Icon } from "@/components/skysolo-ui";
import { useTheme } from 'hyper-native-ui';
import { Text } from "hyper-native-ui";


const AppHeader = memo(function HomeScreen({
    navigation,
    title,
    titleCenter = false,
    rightSideComponent,
    containerStyle,
    backCallback
}: {
    navigation: any
    title: string
    titleCenter?: boolean
    rightSideComponent?: React.ReactNode
    containerStyle?: ViewProps["style"]
    backCallback?: () => void
}) {
    const { currentTheme } = useTheme();

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
                        backCallback && backCallback()
                        navigation.goBack()
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