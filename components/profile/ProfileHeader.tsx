import { memo } from "react";
import { View } from "react-native";
import { Avatar, Text } from "@/components/skysolo-ui"
import { NavigationProps, User } from "@/types";
import ProfileInfoCount from "./ProfileInfoCount";
import ProfileActionsButton from "./ProfileActionsButton";


const ProfileHeader = memo(function HomeScreen({
    navigation,
    userData,
    isProfile
}: {
    navigation: NavigationProps,
    userData: User
    isProfile?: boolean
}) {

    return <View style={{
        width: '100%',
        padding: "3.2%",
    }}>
        <View style={{
            height: 10,
        }} />
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: '100%',
            marginBottom: 8,
        }}>
            <Avatar
                size={120}
                TouchableOpacityOptions={{
                    activeOpacity: 0.9
                }}
                url={userData?.profilePicture} />
            <ProfileInfoCount navigation={navigation} userData={userData} isProfile />
        </View>
        <Text
            style={{
                fontWeight: "600",
                marginVertical: 4
            }}
            variant="heading3">
            {userData?.name}
        </Text>
        <Text
            colorVariant='secondary'
            lineBreakMode="tail"
            style={{ fontWeight: "400" }}
            variant="heading4">
            {`🌍 Adventurer |🍳 Foodie`}
            {`🏍️ ⚙️ "1 N 2 3 4 5" ⚙️`}
            {`⛰️ Mountain Enthusiast`}
            {`🐞 Software Developer`}
        </Text>
        <ProfileActionsButton navigation={navigation} userData={userData} isProfile />
    </View>

})
export default ProfileHeader;