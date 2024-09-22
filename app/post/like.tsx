import AppHeader from "@/components/AppHeader";
import { Avatar, Icon, Text, TouchableOpacity } from "@/components/skysolo-ui";
import { timeAgoFormat } from "@/lib/timeFormat";
import { fetchPostCommentsApi } from "@/redux-stores/slice/post/api.service";
import { RootState } from "@/redux-stores/store";
import { Comment, disPatchResponse } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";


const LikeScreen = memo(function LikeScreen({ navigation }: any) {
    // const post = useSelector((Root: RootState) => Root)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const dispatch = useDispatch()


    const fetchCommentsApi = useCallback(async () => {
        try {
            await dispatch(fetchPostCommentsApi({
                id: "id",
                offset: 0,
                limit: 12
            }) as any)
        } catch (e) {
            setError(true)
            //   toast.error("Failed to load post")
        } finally {
            setLoading(false)
        }
    }, [])

    const onPress = (item: Comment) => {
        console.log('item', item)
    }

    const comments = Array.from({ length: 100 }, () => fakeData)

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Likes" navigation={navigation} />
            <FlashList
                data={comments}
                renderItem={({ item }) => <CommentItem data={item} onPress={onPress} />}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                bounces={false}
                onEndReachedThreshold={0.5}
            // ListHeaderComponent={HomeHeader}
            // onEndReached={fetchPosts}
            // refreshing={refreshing}
            // onRefresh={onRefresh} 
            />
        </View>
    )
})
export default LikeScreen;

const CommentItem = memo(function CommentItem({
    data, onPress
}: {
    data: Comment,
    onPress: (item: Comment) => void
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
            <Avatar source={{ uri: data.user.profilePicture }} size={50}
                onPress={() => onPress(data)} />
            <View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <Text variant="heading3">{data.user.name}</Text>
                </View>
                <Text variant="heading4" secondaryColor>{timeAgoFormat(data?.createdAt)}</Text>
            </View>
        </View>
        <Text variant="heading4" secondaryColor>you</Text>
    </TouchableOpacity>)
})


const fakeData = {
    "id": "db20818c-9a72-4370-8d4e-708c9f584192",
    "content": "RE 🔥🔥🔥 350",
    "authorId": "30840219-080e-4566-b659-bd1b63e697e2",
    "postId": "lucjyx561g",
    "createdAt": "2024-09-11T15:45:01.256Z",
    "updatedAt": null,
    "user": {
        "username": "oliviasen",
        "email": "olivia@gmail.com",
        "name": "Olivia Sen",
        "profilePicture": "https://firebasestorage.googleapis.com/v0/b/my-project-sky-inc.appspot.com/o/skylight%2F30840219-080e-4566-b659-bd1b63e697e2%2FIMG_0032.png.jpeg?alt=media&token=162d991c-2bcf-4626-8207-8b7548612aa7"
    }
}
