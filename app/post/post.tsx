import { memo } from "react";
import { Post } from "@/types";
import AppHeader from "@/components/AppHeader";
import { FeedItem } from "@/components/home";
import ErrorScreen from "@/components/error/page";
import { ScrollView, View } from "react-native";
import { StaticScreenProps } from "@react-navigation/native";
import { FeedLoader } from "@/components/home/feedListItem";
import { useGQObject } from "@/lib/useGraphqlQuery";
import { QPost } from "@/redux-stores/slice/post/post.queries";

type Props = StaticScreenProps<{
    id: string;
}>;
const PostScreen = memo(function PostScreen({ route }: Props) {
    const postId = route.params.id;
    const { data, error, loading, } = useGQObject<Post>({
        query: QPost.findOnePost,
        variables: { findOnePostId: postId }
    })

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Post" titleCenter />
            <ScrollView>
                {loading !== "normal" ? <FeedLoader size={1} />
                    : error ? <ErrorScreen message="Not Found" /> :
                        data ? <FeedItem data={data} /> : <View />}
            </ScrollView>
        </View>
    )
})
export default PostScreen;