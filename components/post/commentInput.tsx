import React, { useEffect } from "react";
import { z } from "zod";
import { memo, useCallback } from "react";
import { ToastAndroid, View } from "react-native";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/redux-stores/store";
import { Input, Separator, ThemedView } from "hyper-native-ui";
import { Icon } from "@/components/skysolo-ui";
import { useGQMutation } from "@/lib/useGraphqlQuery";
import { QPost } from "@/redux-stores/slice/post/post.queries";
import { Comment, Post } from "@/types";

const schema = z.object({
    text: z.string().min(1)
})

const CommentInput = memo(function CommentInput({
    post,
    addItem
}: {
    post: Post,
    addItem: (value: Comment) => void
}) {
    const postId = post.id;
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
        if (!postId) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
        if (!session) return ToastAndroid.show("You need to login to comment", ToastAndroid.SHORT);
        await mutate({
            input: {
                postId: postId,
                content: _data.text,
                authorId: post.user.id
            }
        });
        reset();
    }, [postId, session])

    useEffect(() => {
        if (!data || error) return;
        addItem(data)
    }, [data])


    return (
        <ThemedView>
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
        </ThemedView>
    )
}, (pre, next) => pre.post.id === next.post.id);

export default CommentInput;