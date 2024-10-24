import { memo, useCallback } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "@/components/skysolo-ui"
import { NavigationProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";

const StoriesComponent = memo(function StoriesComponent({
    navigation
}: {
    navigation: NavigationProps,
}) {
    const onPress = useCallback((item: any) => {
        navigation.push('story', { user: item })
    }, [])

    return (
        <View style={{
            width: '100%',
            paddingTop: 8,
        }}>
            <FlatList
                data={Array(100).fill(0)}
                renderItem={({ item }) => <StoriesItem data={item} onPress={onPress} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                scrollEventThrottle={16}
                ListHeaderComponent={<View style={{ width: 6 }} />}
                ListFooterComponent={<View style={{ width: 6 }} />}
                showsHorizontalScrollIndicator={false} />
        </View>)

}, () => true)
export default StoriesComponent;


const StoriesItem = memo(function StoriesItem({
    data, onPress
}: {
    data: any,
    onPress?: (item: any) => void
}) {
    const session = useSelector((state: RootState) => state.AuthState.session.user)

    return (<TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress?.(session)}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 94,
            height: 110,
        }}>
        <Avatar url={session?.profilePicture} size={80}
            onPress={() => onPress?.(session)} />
        <Text variant="heading4" colorVariant="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {session?.username}
        </Text>
    </TouchableOpacity>)
}, () => true)