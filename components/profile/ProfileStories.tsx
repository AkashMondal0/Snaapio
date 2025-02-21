import React from "react";
import { memo, useCallback } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Icon, Avatar } from "@/components/skysolo-ui";
import { User, Highlight } from "@/types";
import { Text, useTheme } from "hyper-native-ui"
import { StackActions, useNavigation } from "@react-navigation/native";
import { useGQArray } from "@/lib/useGraphqlQuery";
import { QProfile } from "@/redux-stores/slice/profile/profile.queries";
const ITEM_HEIGHT = 120;
const StoriesComponent = memo(function StoriesComponent({
    user,
    isProfile
}: {
    user?: User | null,
    isProfile?: boolean
}) {
    const navigation = useNavigation();
    const { currentTheme } = useTheme();
    const { data, error, loadMoreData, loading, reload } = useGQArray<Highlight>({
        query: QProfile.findAllHighlight,
        variables: { id: user?.id }
    });

    const navigateToHighlight = useCallback((item: Highlight) => {
        navigation.dispatch(StackActions.push("Highlight" as any, {
            user: user,
            highlight: item
        }));
    }, [user])

    const navigateToHighlightUpload = useCallback(() => {
        navigation.navigate("HighlightSelect")
    }, [])

    return (
        <View style={{
            width: '100%',
            paddingTop: 8,
        }}>
            <FlatList
                data={data}
                renderItem={({ item }) => <StoriesItem data={item} onPress={navigateToHighlight} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                scrollEventThrottle={16}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                bounces={false}
                removeClippedSubviews={true}
                windowSize={12}
                getItemLayout={(data, index) => ({
                    index,
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index
                })}
                ListFooterComponent={<View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{ width: 6 }} />
                    {isProfile ?
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={navigateToHighlightUpload}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 100,
                                height: 120,
                            }}>
                            <View
                                style={{
                                    width: 84,
                                    aspectRatio: 1 / 1,
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderWidth: 1.4,
                                    borderColor: currentTheme.muted_foreground,
                                    marginBottom: 4,
                                }}>
                                <Icon
                                    iconName="Plus"
                                    size={60}
                                    variant="secondary"
                                    iconColorVariant="secondary"
                                    strokeWidth={1}
                                    onPress={navigateToHighlightUpload} />
                            </View>
                            <Text variantColor="secondary">Highlight</Text>
                        </TouchableOpacity> : <></>}
                </View>}
                ListHeaderComponent={<View style={{ width: 6 }} />}
                ListEmptyComponent={() => {
                    if (loading === "idle" || loading === "pending") {
                        return <StoryLoader />
                    }
                    if (error && loading === "normal") return <View />
                    return <View />
                }}
                showsHorizontalScrollIndicator={false} />
        </View>)

}, (pre, next) => pre.user?.id === next.user?.id)
export default StoriesComponent;

export const StoriesItem = memo(function StoriesItem({
    data, onPress
}: {
    data: Highlight,
    onPress?: (item: Highlight) => void
}) {
    if (!data || !data.stories || !data.stories[0]?.fileUrl) return <></>
    return (<TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress?.(data)}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 120,
        }}>
        <Avatar
            isBorder
            size={80}
            borderColorVariant="secondary"
            url={data?.stories[0]?.fileUrl[0] ? data?.stories[0].fileUrl[0].urls?.high : null}
            onPress={() => onPress?.(data)} />
        <Text variantColor="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {data?.content}
        </Text>
    </TouchableOpacity>)
}, () => true)


export const StoryLoader = () => {
    const { currentTheme } = useTheme();
    return <View style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
        height: 120,
        alignItems: "center"
    }}>
        {Array(10).fill(0).map((_, i) => <View key={i} style={{
            width: 80,
            height: 100,
            aspectRatio: 1,
            borderRadius: 100,
            backgroundColor: currentTheme.muted
        }} />)}
    </View>
}