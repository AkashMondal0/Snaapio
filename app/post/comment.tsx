import React, { useEffect } from "react";
import { z } from "zod";
import { memo, useCallback, useState } from "react";
import { FlatList, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/redux-stores/store";
import { Input, Text, TouchableOpacity, Separator, Loader } from "hyper-native-ui";
import { StackActions, StaticScreenProps, useNavigation } from "@react-navigation/native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { timeAgoFormat } from "@/lib/timeFormat";
import AppHeader from "@/components/AppHeader";
import ErrorScreen from "@/components/error/page";
import ListEmpty from "@/components/ListEmpty";
import UserItemLoader from "@/components/loader/user-loader";
import { useGQArray, useGQMutation } from "@/lib/useGraphqlQuery";
import { QPost } from "@/redux-stores/slice/post/post.queries";
import { Comment } from "@/types";

const schema = z.object({
    text: z.string().min(1)
})
type Props = StaticScreenProps<{
    id: string;
}>;

const CommentScreen = memo(function CommentScreen({ route }: Props) {
    const postId = route?.params?.id;
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
                ListEmptyComponent={() => {
                    if (error && loading === "normal") {
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
            <CommentInput postId={postId} addItem={addItemUnshift} />
        </View>
    )
})
export default CommentScreen;

const CommentItem = memo(function CommentItem({
    data,
}: {
    data: Comment
}) {
    const navigation = useNavigation()
    const [readMore, setReadMore] = useState(false)

    if (!data.user) return <></>
    return (<TouchableOpacity
        onPress={() => setReadMore(!readMore)}
        style={{
            flexDirection: 'row',
            padding: 12,
            alignItems: 'center',
            width: '100%',
            gap: 6,
            marginVertical: 2,
            justifyContent: 'space-between',
        }}>
        <View style={{
            gap: 10,
            alignItems: 'center',
            flexDirection: 'row',
            flexBasis: '76%',
        }}>
            <Avatar url={data.user.profilePicture} size={50}
                onPress={() => {
                    navigation.dispatch(StackActions.replace("Profile", { id: data.user.username }))
                }} />
            <View>
                <Text numberOfLines={readMore ? 100 : 3} ellipsizeMode="tail">
                    <TouchableWithoutFeedback
                        onPress={() => {
                            navigation.dispatch(StackActions.replace("Profile", { id: data.user.username }))
                        }}>
                        <Text lineBreakMode="clip" numberOfLines={2}>
                            {data.user.name}{" "}
                        </Text>
                    </TouchableWithoutFeedback>
                    <Text
                        variantColor="secondary"
                        numberOfLines={2}>
                        {data.content}
                    </Text>
                </Text>
                {/* action */}
                <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <Text variantColor="secondary" variant="body2">
                        {timeAgoFormat(data.createdAt)}
                    </Text>
                    <Text variantColor="default">
                        reply
                    </Text>
                    <Text variantColor="Red">
                        report
                    </Text>
                </View>
            </View>
        </View>
        <Icon iconName="Heart" size={24}
            onPress={() => {
                navigation.navigate("Profile", { id: data.user.username })
            }}
            style={{
                width: "10%"
            }} />
    </TouchableOpacity>)
}, (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
});

const CommentInput = memo(function CommentInput({
    postId,
    addItem
}: {
    postId: string,
    addItem: (value: Comment) => void
}) {
    const session = useSelector((Root: RootState) => Root.AuthState.session.user);
    const { control, reset, handleSubmit } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { text: "" }
    });
    const {
        data,
        error,
        loading,
        mutate
    } = useGQMutation<Comment>({
        mutation: QPost.createComment,
    });

    const handleComment = useCallback(async (_data: { text: string }) => {
        if (_data.text.length <= 0) return;
        if (!postId) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
        if (!session) return ToastAndroid.show("You need to login to comment", ToastAndroid.SHORT)
        await mutate({
            input: {
                postId: postId,
                content: _data.text,
                authorId: session?.id
            }
        });
        reset();
    }, [postId, session])

    useEffect(() => {
        if (!data || error) return;
        addItem(data)
    }, [data])


    return (
        <>
            <Separator value={0.8} />
            <View style={{
                width: "100%",
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.6%",
                gap: 6,
            }}>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            keyboardType="default"
                            placeholder="Type a message"
                            multiline
                            disabled={loading}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            returnKeyType="send"
                            onSubmitEditing={handleSubmit(handleComment)}
                            style={{
                                flex: 1,
                                height: "100%",
                                borderRadius: 20,
                                borderWidth: 0,
                                maxHeight: 100
                            }}
                            containerStyle={{
                                flexShrink: 1
                            }} />
                    )}
                    name="text"
                    rules={{ required: true }} />
                <View style={{ height: 45 }}>
                    <Icon
                        iconName="Send"
                        isButton
                        size={26}
                        disabled={loading}
                        onPress={handleSubmit(handleComment)}
                        style={{
                            height: 45,
                            aspectRatio: 1 / 1,
                        }} />
                </View>
            </View>
        </>
    )
}, (pre, next) => pre.postId === next.postId);