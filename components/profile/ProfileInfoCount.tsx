import { memo } from "react";
import { NavigationProps, User } from "@/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "hyper-native-ui";


const ProfileInfoCount = memo(function ProfileInfoCount({
    navigation,
    userData,
}: {
    navigation: NavigationProps,
    userData: User | null,
}) {
    const counts = [
        { title: "Posts", count: userData?.postCount, onPress: () => { } },
        {
            title: "Followers", count: userData?.followerCount, onPress: () => {
                navigation.push('profile/followersAndFollowing', {
                    screen: 'followers',
                    params: { username: userData?.username, tab: 0 }
                })
            }
        },
        {
            title: "Following", count: userData?.followingCount, onPress: () => {
                navigation.push('profile/followersAndFollowing', {
                    screen: 'following',
                    params: { username: userData?.username, tab: 1 }
                })
            }
        }
    ]

    return (<View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }}>
        {counts.map((item, index) => (
            <TouchableOpacity key={index} style={{ alignItems: 'center' }}
                onPress={item.onPress}
                activeOpacity={0.8}>
                <Text bold={"bold"} size={20}>{item.count}</Text>
                <Text variantColor="secondary">{item.title}</Text>
            </TouchableOpacity>
        ))}
    </View>)
})
export default ProfileInfoCount;
