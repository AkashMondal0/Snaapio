import { memo } from "react";
import { User } from "@/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "hyper-native-ui";
import { useNavigation } from "@react-navigation/native";


const ProfileInfoCount = memo(function ProfileInfoCount({
    userData,
}: {
    userData: User | null,
}) {
    const navigation = useNavigation();
    const counts = [
        { title: "Posts", count: userData?.postCount, onPress: () => { } },
        {
            title: "Followers", count: userData?.followerCount, onPress: () => {
                if (userData?.username) {
                    navigation.navigate("ProfileFollowingFollowers", {
                        id: userData.username,
                        section: "Followers"
                    });
                }
            }
        },
        {
            title: "Following", count: userData?.followingCount, onPress: () => {
                if (userData?.username) {
                    navigation.navigate("ProfileFollowingFollowers", {
                        id: userData.username,
                        section: "Following"
                    });
                }
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
