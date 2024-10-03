import ErrorScreen from "@/components/error/page";
import { ProfileHeader, ProfileNavbar, ProfileStories } from "@/components/profile";
import { Loader } from "@/components/skysolo-ui";
import { useGraphqlQuery, useGraphqlQueryList } from "@/lib/useGraphqlQuery";
import { QProfile } from "@/redux-stores/slice/profile/profile.queries";
import { RootState } from "@/redux-stores/store";
import { NavigationProps, Post, User } from "@/types";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View, Image } from "react-native";
import { useSelector } from "react-redux";

interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: { username: string }
    }
}
const AccountScreen = ({ navigation, route }: ScreenProps) => {
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const UserData = useGraphqlQuery<User>({
        query: QProfile.findUserProfile,
        variables: { username: session?.username },
        initialFetch: session?.username ? true : false
    });
    const Posts = useGraphqlQueryList<Post[]>({
        query: QProfile.findAllPosts,
        variables: {
            findAllPosts: {
                id: UserData.data?.id,
                limit: 120,
                offset: 0,
            }
        },
        initialFetch: UserData.data ? true : false,
    });
    

    const loading = UserData.loading === "idle" && Posts.loading === "idle" || UserData.loading === "pending" && Posts.loading === "pending"
    if (UserData.error) return <ErrorScreen />

    return (
        <View style={{
            width: '100%',
            height: '100%',
        }}>
            <ProfileNavbar navigation={navigation} isProfile username={session?.username || "No User"} />
            <FlashList
                data={Posts.data}
                estimatedItemSize={100}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                bounces={false}
                refreshing={false}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            width: '100%',
                            height: 100,
                            aspectRatio: 1,
                        }}>
                        <Image
                            source={{ uri: item.fileUrl[0] }}
                            resizeMode="cover"
                            style={{
                                width: '100%',
                                height: "100%",
                            }} />
                    </View>
                )}
                ListHeaderComponent={<>
                    <ProfileHeader
                        navigation={navigation}
                        userData={UserData.data}
                        isProfile />
                    <ProfileStories navigation={navigation} />
                </>}
            // onRefresh={UserData.refetch}
            // onEndReached={() => delayFetchProfilePosts(userData?.id)}
            // ListEmptyComponent={<></>}
            ListFooterComponent={() => <>{loading ? <View style={{
                width: '100%',
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Loader size={40} />
            </View> : <></>}</>}
            />
        </View>
    )
}

export default AccountScreen;