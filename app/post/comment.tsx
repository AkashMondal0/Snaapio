import React from "react";
import { z } from "zod";
import { memo } from "react";
import { FlatList, View } from "react-native";
import { Loader } from "hyper-native-ui";
import { StaticScreenProps } from "@react-navigation/native";
import AppHeader from "@/components/AppHeader";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import UserItemLoader from "@/components/loader/user-loader";
import { useGQArray, useGQObject } from "@/lib/useGraphqlQuery";
import { QPost } from "@/redux-stores/slice/post/post.queries";
import { Comment, Post } from "@/types";
import CommentItem from "@/components/post/commentItem";
import CommentInput from "@/components/post/commentInput";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
type Props = StaticScreenProps<{
    id: string;
}>;

const CommentScreen = memo(function CommentScreen({ route }: Props) {
    const postId = route?.params?.id;
    const { data: postData, error: PostError, loading: postLoading } = useGQObject<Post>({
        query: QPost.findOnePost,
        variables: { id: postId }
    });
    const { data, error, loadMoreData, loading, reload, requestCount, addItemUnshift } = useGQArray<Comment>({
        query: QPost.findAllComments,
        variables: { id: postId }
    });

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title="Comments" />
            <FlatList
                data={data}
                renderItem={({ item }) => <CommentItem data={item} />}
                keyExtractor={(item) => item.id}
                removeClippedSubviews={true}
                scrollEventThrottle={16}
                windowSize={10}
                bounces={false}
                onEndReachedThreshold={1}
                refreshing={false}
                onEndReached={loadMoreData}
                onRefresh={reload}
                renderScrollComponent={(props) => <KeyboardAwareScrollView {...props} />}
                ListEmptyComponent={() => {
                    if (error && loading === "normal" || error && postLoading === "normal") {
                        return <ErrorScreen message={error} />;
                    }
                    if (data.length <= 0 && loading === "normal") {
                        return <ListEmpty text="No Comments yet" />;
                    }
                    return <View />
                }}
                ListFooterComponent={() => {
                    if (loading !== "normal" && requestCount === 0) {
                        return <UserItemLoader />;
                    }
                    if (loading === "pending") {
                        return <Loader size={50} />
                    }
                    return <View />;
                }} />
            <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
                {postData?.id ? <CommentInput post={postData} addItem={addItemUnshift} /> : <></>}
            </KeyboardStickyView>
        </View>
    )
})
export default CommentScreen;