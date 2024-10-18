import { memo, useCallback } from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { Avatar, Text, Loader } from "@/components/skysolo-ui"
import { NavigationProps, User } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";

const ProfileStories = ({
    navigation, userData, isProfile
}: {
    navigation: NavigationProps,
    userData?: User
    isProfile?: boolean
}) => {
    const uploadAssets = useSelector((state: RootState) => state.AccountState.uploadFile, (prev, next) => prev === next)
    const borderColor = useSelector((state: RootState) => state.ThemeState.currentTheme?.border, (prev, next) => prev === next)

    const onPress = useCallback((item: any) => {
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
            {uploadAssets ? <View>
                <View style={{
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: "space-between",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: borderColor,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <Loader size={30} />
                        <Text variant="heading3" style={{ padding: 4 }}>
                            Uploading...
                        </Text>
                    </View>
                    <Image
                        source={{ uri: uploadAssets }}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 18
                        }}
                    />
                </View>
            </View> : <></>}
        </View>)

}
export default ProfileStories;


const StoriesItem = memo(function StoriesItem({
    data, onPress
}: {
    data: any,
    onPress?: (item: any) => void
}) {
    const session = useSelector((state: RootState) => state.AuthState.session.user)

    return (<TouchableOpacity
        activeOpacity={0.9}
        style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 110,
        }}>
        <Avatar url={session?.profilePicture} size={80} />
        <Text variant="heading4" colorVariant="secondary" style={{ padding: 4 }} numberOfLines={1}>
            {session?.username}
        </Text>
    </TouchableOpacity>)
}, () => true)