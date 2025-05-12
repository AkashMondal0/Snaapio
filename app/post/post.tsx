import { memo } from "react";
import { Post } from "@/types";
import AppHeader from "@/components/AppHeader";
import ErrorScreen from "@/components/error/page";
import { ScrollView, View } from "react-native";
import { StaticScreenProps } from "@react-navigation/native";
import { useGQObject } from "@/lib/useGraphqlQuery";
import { QPost } from "@/redux-stores/slice/post/post.queries";
import { Loader } from "hyper-native-ui";
import { FeedItem } from "@/components/post";
import { ShortVideoComponent } from "@/components/short-video";

type Props = StaticScreenProps<{
    id: string;
}>;

const PostScreen = memo(function PostScreen({ route }: Props) {
    const postId = route.params.id;

    const { data, error, loading } = useGQObject<Post>({
        query: QPost.findOnePost,
        variables: { id: postId }
    });

    if (loading !== "normal" && !data) {
        return (
            <View style={{
                flex: 1, width: "100%", height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Loader size={40} />
            </View>
        );
    }

    if (error && loading !== "normal") {
        return <ErrorScreen />;
    }

    if (data?.type === "short") {
        return <ShortVideoComponent data={data} navigateToProfile={() => { }} />;
    }


    return (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <AppHeader title="Post" titleCenter />
            <ScrollView>
                {data ? <FeedItem data={data} /> : null}
            </ScrollView>
        </View>
    );
});

export default PostScreen;