import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Post } from '@/types';
import { Heart } from 'lucide-react-native';
import useDebounce from '@/lib/debouncing';
import { Text } from 'hyper-native-ui';
import { Icon } from '@/components/skysolo-ui';
import React from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { QPost } from '@/redux-stores/slice/post/post.queries';
import { useGQMutation } from '@/lib/useGraphqlQuery';
import useAppState from '@/hooks/AppState';
import { setShareSheetData } from '@/redux-stores/slice/dialog';
import { useDispatch } from 'react-redux';

const FeedItemActionsButtons = (
    {
        post,
    }: {
        post: Post
    }
) => {
    const { handleSnapPress } = useAppState();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [like, setLike] = useState({
        isLike: post.is_Liked,
        likeCount: post.likeCount
    })

    const { mutate } = useGQMutation<boolean>({
        mutation: QPost.createAndDestroyLike,
        onError: (err) => {
            setLike((pre) => ({
                isLike: !pre.isLike,
                likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
            }));
        }
    });

    const delayLike = useCallback((value: boolean) => {
        if (!post?.id) return;
        mutate({ input: { id: post?.id, like: value } })
    }, [post?.id])

    const debounceLike = useDebounce(delayLike, 500)

    const onLike = useCallback(() => {
        setLike((pre) => ({
            isLike: !pre.isLike,
            likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
        }))
        debounceLike(!like.isLike)
    }, [like.isLike, like.likeCount])

    const AData = [
        {
            iconName: "MessageCircle",
            count: post.commentCount,
            size: 30,
            onPress: () => navigation.dispatch(StackActions.push("PostComment", { id: post.id })),
        },
        {
            iconName: "Send",
            count: "",
            size: 28,
            onPress: () => {
                dispatch(setShareSheetData(post))
                handleSnapPress(0)
            },
        },
    ]
    return (
        <View style={{
            display: 'flex',
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: "2%",
            paddingTop: 10,
            gap: 10
        }}>
            <View style={{
                display: 'flex',
                flexDirection: "row",
                gap: 18
            }}>
                <View style={{
                    display: 'flex',
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center"
                }} key={"like"}>
                    {!like.isLike ? <Icon iconName={"Heart"} size={30} onPress={onLike} /> :
                        <Heart size={30} fill={like.isLike ? "red" : ""} onPress={onLike} />}
                    <TouchableOpacity onPress={() => navigation.navigate("PostLike", { id: post.id })} >
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600"
                        }}>
                            {like.likeCount}
                        </Text>
                    </TouchableOpacity>
                </View>
                {AData.map((item, index) => (
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center"
                    }} key={index}>
                        <Icon iconName={item.iconName as any}
                            size={item.size}
                            onPress={item.onPress}
                            style={{
                                transform: [{ rotateY: item.iconName === "MessageCircle" ? "180deg" : "0deg" }]
                            }} />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600"
                        }}>{item.count}</Text>
                    </View>
                ))}
            </View>
            <Icon iconName="Bookmark" size={30} onPress={() => {}} />
        </View>
    )
}

export default FeedItemActionsButtons;