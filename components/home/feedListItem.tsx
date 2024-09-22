import { Avatar, Text, Image, View, Icon } from '@/components/skysolo-ui';
import { Post } from '@/types';
import { Heart } from 'lucide-react-native';
import { memo, useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

const FeedItem = memo(function Item({
    data,
    onPress
}: {
    data: Post,
    onPress: (post: Post, path: "like" | "comment") => void,
}) {

    return <View style={{
        width: "100%",
        paddingVertical: 14,
        // borderBottomWidth: 0.2,
    }}>
        <View style={{
            marginHorizontal: "3%",
            paddingVertical: 10,
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <Avatar
                size={45}
                url={data.user?.profilePicture} />
            <View>
                <Text
                    style={{ fontWeight: "600" }}
                    variant="heading3">
                    {data?.user?.name}
                </Text>
                <Text
                    style={{
                        fontWeight: "400",
                    }}
                    secondaryColor
                    variant="heading4">
                    {`los angeles, CA`}
                </Text>
            </View>
        </View>
        <PagerView
            initialPage={0}
            style={{
                width: "100%",
                minHeight: 460,
            }}>
            {data.fileUrl.map((mediaUrl, index) => (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} key={index}>
                    <Image
                        isBorder
                        resizeMode="cover"
                        resizeMethod="auto"
                        src={mediaUrl}
                        style={{
                            width: "96%",
                            flex: 1,
                            borderRadius: 20
                        }} />
                </View>
            ))}
        </PagerView>
        {/* action */}
        <View>
            <FeedItemActionsButtons data={data} onPress={onPress} />
            <View style={{
                marginHorizontal: "3%",
            }}>
                {data?.content ? <Text variant="heading4" style={{
                    fontWeight: "600"
                }}>{data?.content}</Text> : <></>}
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={() => onPress(data, "comment")} >
                <Text variant="heading4"
                    secondaryColor
                    style={{
                        marginHorizontal: "3%",
                        fontWeight: "400",
                        paddingVertical: 5
                    }}>
                    View all comments
                </Text>
            </TouchableOpacity>
        </View>
    </View>
}, (prev, next) => {
    return prev.data.id === next.data.id
})


export default FeedItem;

const FeedItemActionsButtons = memo(function FeedItemActionsButtons(
    {
        data,
        onPress
    }: {
        onPress: (post: Post, path: "like" | "comment") => void,
        data: Post
    }
) {
    const [isLiked, setIsLiked] = useState(data.is_Liked)
    const [likeCount, setLikeCount] = useState(data.likeCount)
    // const [isSaved, setIsSaved] = useState(false)

    const onLike = useCallback(() => {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    }, [isLiked])

    const AData = [
        {
            iconName: "MessageCircle",
            count: data.commentCount,
            size: 30,
            onPress: () => onPress(data, "comment"),
        },
        {
            iconName: "Send",
            count: "",
            size: 28,
            onPress: () => { },
        },
    ]
    return (
        <View style={{
            display: 'flex',
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: "3%",
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
                    {!isLiked ? <Icon iconName={"Heart"} size={30} onPress={onLike} /> :
                        <Heart size={30} fill={isLiked ? "red" : ""} onPress={onLike} />}
                    <TouchableOpacity onPress={() => onPress(data, "like")} >
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600"
                        }}>
                            {likeCount}
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
                                // transform: [{ rotateY: item.iconName === "MessageCircle" ? "180deg" : "0deg" }]
                            }} />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600"
                        }}>{item.count}</Text>
                    </View>
                ))}
            </View>
            <Icon iconName="Bookmark" size={30} />
        </View>
    )
})