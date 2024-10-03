import ErrorScreen from "@/components/error/page";
import { ProfileHeader, ProfileNavbar } from "@/components/profile";
import { Loader } from "@/components/skysolo-ui";
import { useGraphqlQuery, useGraphqlQueryList } from "@/lib/useGraphqlQuery";
import { QProfile } from "@/redux-stores/slice/profile/profile.queries";
import { RootState } from "@/redux-stores/store";
import { NavigationProps, Post, User } from "@/types";
import React from "react";
import { View, Image, FlatList } from "react-native";
import { useSelector } from "react-redux";

interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: { username: string }
    }
}
const ProfileScreen = ({ navigation, route }: ScreenProps) => {
    const username = route.params?.username
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const isProfile = session?.username === username
    const UserData = useGraphqlQuery<User>({
        query: QProfile.findUserProfile,
        variables: { username },
        initialFetch: true
    });
    const Posts = useGraphqlQueryList<Post[]>({
        query: QProfile.findAllPosts,
        variables: {
            findAllPosts: {
                id: UserData.data?.id,
                limit: 50,
                offset: 0,
            }
        },
        initialFetch: UserData.data ? true : false,
    });
    const loading = Posts.loading === "idle" || Posts.loading === "pending"

    if (UserData.error) return <ErrorScreen />

    return (
        <View style={{
            width: '100%',
            height: '100%',
        }}>
            <ProfileNavbar navigation={navigation}
                isProfile={isProfile} username={username} />
            <FlatList
                data={Posts.data}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                bounces={false}
                refreshing={false}
                onEndReachedThreshold={0.5}
                removeClippedSubviews={true}
                windowSize={10}
                columnWrapperStyle={{
                    gap: 2,
                    paddingVertical: 1,
                }}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            width: "33%",
                            height: "100%",
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
                ListHeaderComponent={UserData.data ? <>
                    <ProfileHeader
                        navigation={navigation}
                        userData={UserData.data}
                        isProfile={isProfile} />
                </> : <></>}
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

export default ProfileScreen;