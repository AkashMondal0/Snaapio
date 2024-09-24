import { memo } from "react";
import { NavigationProps, User } from "@/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/skysolo-ui"


const ProfileInfoCount = memo(function ProfileInfoCount({
    navigation,
    userData,
    isProfile
}: {
    navigation: NavigationProps,
    userData: User | null,
    isProfile: boolean
}) {

    const counts = [
        { title: "Posts", count: userData?.postCount, onPress: () => { } },
        { title: "Followers", count: userData?.followerCount, onPress: () => { navigation.navigate('profile/followers', { params: userData?.username }) } },
        { title: "Following", count: userData?.followingCount, onPress: () => { navigation.navigate('profile/following', { params: userData?.username }) } }
    ]

    return (<View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }}>
        {counts.map((item, index) => (
            <TouchableOpacity key={index} style={{ alignItems: 'center' }} onPress={item.onPress} activeOpacity={0.8}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.count}</Text>
                <Text variant="heading4" colorVariant="secondary">{item.title}</Text>
            </TouchableOpacity>
        ))}
    </View>)
})
export default ProfileInfoCount;
