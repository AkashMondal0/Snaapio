import { memo, useCallback } from "react";
import { Avatar, Icon, View as Themed, Text, Image } from "@/components/skysolo-ui";
import { AuthorData, NavigationProps } from "@/types";
import { View } from "react-native";

interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: { user: AuthorData }
    }
}

const StoryScreen = memo(function StoryScreen({
    navigation,
    route
}: ScreenProps) {
    const { user } = route.params;
    const PressBack = useCallback(() => { navigation?.goBack() }, [])
    return (
        <Themed style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            {/* header */}
            <Header PressBack={PressBack} user={user} />
            {/* story */}
            <View style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: "absolute",
                top: 0,
            }}>
                <Image
                    contentFit="cover"
                    url={user?.profilePicture}
                    style={{ width: "100%", height: "100%" ,
                        aspectRatio: 9/16,
                    }} />
            </View>
        </Themed>
    )
})
export default StoryScreen;

const Header = ({
    PressBack,
    user
}:{
    PressBack: () => void;
    user: AuthorData;
}) => {
    return <View style={{
        width: "100%",
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 6,
        paddingHorizontal: 3,
        position: "absolute",
        top: 0,
        zIndex: 1,
        height: 70,
    }}>
        <View style={{
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        }}>
            <Icon iconName={"ArrowLeft"} size={30} onPress={PressBack} />
            <View style={{
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
            }}>
                <Avatar
                    size={50}
                    url={user?.profilePicture} />
                <View>
                    <Text
                        style={{ fontWeight: "600" }}
                        variant="heading4">
                        {user?.name}
                    </Text>
                    <Text
                        colorVariant="secondary"
                        style={{ fontWeight: "400" }}
                        variant="heading4">
                        today
                    </Text>
                </View>
            </View>
        </View>
        <View style={{ paddingRight: 10 }}>
            <Icon iconName={"Info"} isButton variant="secondary" size={26} style={{ elevation: 2 }} />
        </View>
    </View>;
}
