import AppHeader from "@/components/AppHeader";
import { memo } from "react";
import { View } from "react-native";


const PostsScreen = memo(function PostsScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Posts" navigation={navigation} />
        </View>
    )
})
export default PostsScreen;