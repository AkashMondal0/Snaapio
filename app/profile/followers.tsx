import { Avatar, Button, Text, TouchableOpacity } from "@/components/skysolo-ui";
import { AuthorData, NavigationProps } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo } from "react";
import { View } from "react-native";
interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            params: { username: string }
        }
    }
}

const FollowersScreen = memo(function FollowersScreen({ navigation, route }: ScreenProps) {


    const onPress = (item: AuthorData) => {
        // navigation.navigate('Profile', { username: item.username })
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <FlashList
                data={list}
                renderItem={({ item }) => (<FollowingItem data={item} onPress={onPress} />)}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
            // bounces={false}
            // onEndReachedThreshold={0.5}
            // onEndReached={fetchLikes}
            // refreshing={false}
            // onRefresh={onRefresh}
            />
        </View>
    )
})
export default FollowersScreen;

const FollowingItem = memo(function FollowingItem({
    data,
    onPress
}: {
    data: AuthorData,
    onPress: (item: AuthorData) => void
}) {
    return (<TouchableOpacity style={{
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        width: '100%',
        gap: 10,
        marginVertical: 2,
        justifyContent: 'space-between',
    }}>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
        }}>
            <Avatar url={data.profilePicture} size={50} onPress={() => onPress(data)} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Text variant="heading3">
                        {data.username}
                    </Text>
                </View>
                <Text variant="heading4" colorVariant="secondary">
                    {data.name}
                </Text>
            </View>
        </View>
        <Button
            textStyle={{
                fontSize: 14,
            }}
            size="medium"
            variant="secondary">
            Message
        </Button>
    </TouchableOpacity>)
})

const list = [
    {
        "id": "aff8475e-4d00-4d29-b633-107b7d701502",
        "username": "mrunalthakur",
        "email": "mrunalthakur@gmail.com",
        "name": "Mrunal Thakur",
        "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2Faff8475e-4d00-4d29-b633-107b7d701502%2FIMG_0033.png.jpeg?alt=media&token=ccc724a7-4d93-4b07-9d10-7bd6dfa06e3f",
        "followed_by": false,
        "following": false
    },
    {
        "id": "afb707d7-70be-48ff-b256-1d5b470832be",
        "username": "test",
        "email": "test@gmail.com",
        "name": "Test",
        "profilePicture": null,
        "followed_by": false,
        "following": false
    },
    {
        "id": "30840219-080e-4566-b659-bd1b63e697e2",
        "username": "oliviasen",
        "email": "olivia@gmail.com",
        "name": "Olivia Sen",
        "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F30840219-080e-4566-b659-bd1b63e697e2%2FIMG_0032.png.jpeg?alt=media&token=162d991c-2bcf-4626-8207-8b7548612aa7",
        "followed_by": false,
        "following": false
    }
]