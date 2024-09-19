import { memo } from "react";
import { View } from "react-native";
import { Icon, Text } from "@/components/skysolo-ui"
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";


const AppHeader = memo(function HomeScreen({
    navigation,
    title,
    titleCenter = false,
    rightSideComponent
}: {
    navigation: any
    title: string
    titleCenter?: boolean
    rightSideComponent?: React.ReactNode
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return (
        <View style={{
            width: '100%',
            height: 55,
            borderBottomWidth: 0.8,
            borderColor: currentTheme?.border,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: titleCenter ? 'center' : 'space-between'
        }}>
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
                    fontSize: 24,
                    fontWeight: 'semibold'
                }}>
                    {title}
                </Text>
            </View>
            <View style={{
                marginRight: 8
            }}>
                {rightSideComponent}
            </View>
        </View>
    )
})
export default AppHeader;