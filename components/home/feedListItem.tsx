import { Avatar, Text, Image, View, Icon } from '@/components/skysolo-ui';
import { Post } from '@/types';
import { Heart } from 'lucide-react-native';
import { memo, useState } from 'react';
import PagerView from 'react-native-pager-view';

const FeedItem = memo(function Item({ data }: { data: Post }) {

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
            {Array(3)?.fill(0).map((mediaUrl, index) => (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }} key={index}>
                    <Image
                        isBorder
                        resizeMode="cover"
                        resizeMethod="auto"
                        src={data.fileUrl[0]}
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
            <FeedItemActionsButtons data={data} />
            <View style={{
                marginHorizontal: "3%",
            }}>
                {data?.content ? <Text variant="heading4" style={{
                    fontWeight: "600"
                }}>{data?.content}</Text> : <></>}
            </View>
            <Text variant="heading4"
                secondaryColor
                style={{
                    marginHorizontal: "3%",
                    fontWeight: "400",
                    paddingVertical: 5
                }}>
                View all comments
            </Text>
        </View>
    </View>
}, (prev, next) => {
    return prev.data.id === next.data.id
})


export default FeedItem;

const FeedItemActionsButtons = memo(function FeedItemActionsButtons(
    { data }: { data: Post }
) {
    const [isLiked, setIsLiked] = useState(data.is_Liked)
    // const [isSaved, setIsSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(data.likeCount)


    const AData = [
        {
            iconName: "Heart",
            count: likeCount,
            size: 30,
            onPress: () => {
                setIsLiked(!isLiked)
                if (isLiked) {
                    setLikeCount(likeCount - 1)
                } else {
                    setLikeCount(likeCount + 1)
                }
            },
        },
        {
            iconName: "MessageCircle",
            count: data.commentCount,
            size: 30,
            onPress: () => {

            },
        },
        {
            iconName: "Send",
            count: "",
            size: 28,
            onPress: () => {

            },
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
                {AData.map((item, index) => (
                    <View style={{
                        display: 'flex',
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center"
                    }} key={index}>
                        {item.iconName === "Heart" && isLiked ?
                            <Heart size={item.size} fill={"red"} onPress={item.onPress} />
                            : <Icon iconName={item.iconName as any}
                                size={item.size}
                                onPress={item.onPress}
                                style={{
                                    // transform: [{ rotateY: item.iconName === "MessageCircle" ? "180deg" : "0deg" }]
                                }} />}
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