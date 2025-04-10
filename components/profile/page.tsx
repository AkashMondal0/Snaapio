import React, { useCallback, useEffect } from "react";
import { Loader } from "hyper-native-ui";
import { RootState } from "@/redux-stores/store";
import { View, FlatList, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import ErrorScreen from "@/components/error/page";
import { ProfileEmptyPosts, ProfileGridItem, ProfileHeader, ProfileNavbar } from "@/components/profile";
import { Post, User } from "@/types";
import { useGQArray, useGQObject } from "@/lib/useGraphqlQuery";
import { QProfile } from "@/redux-stores/slice/profile/profile.queries";

const screenWidth = Dimensions.get("screen").width;
const ITEM_HEIGHT = screenWidth * 0.33;

const ProfilePage = ({ username }: { username: string }) => {
	const session = useSelector((state: RootState) => state.AuthState.session.user);
	const isProfile = session?.username === username;
	const {
		data: dataUser,
		error: errorUser,
		loading: loadingUser,
		reload: reloadUser
	} = useGQObject<User>({
		query: QProfile.findUserProfile,
		variables: { id: username }
	});
	const {
		data: dataPost,
		error: errorPost,
		loadMoreData: loadMoreDataPost,
		loading: loadingPost,
		reload: reloadPost } = useGQArray<Post>({
			query: QProfile.findAllPosts,
			variables: { id: dataUser?.id, limit: 12 },
			initialFetch: false
		});

	const onRefresh = useCallback(() => {
		reloadUser();
		reloadPost();
	}, [dataUser?.id])

	useEffect(() => {
		if (!dataUser?.id) return;
		reloadPost();
	}, [dataUser?.id])

	return (
		<View style={{
			flex: 1,
			width: '100%',
			height: '100%',
		}}>
			<ProfileNavbar
				isProfile={isProfile} username={username} isVerified={dataUser?.isVerified} />
			{!dataUser?.id ? <View style={{
				width: '100%',
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<Loader size={40} />
			</View> : <FlatList
				data={dataPost}
				keyExtractor={(item, index) => item.id}
				numColumns={3}
				bounces={false}
				bouncesZoom={false}
				alwaysBounceHorizontal={false}
				alwaysBounceVertical={false}
				refreshing={false}
				onEndReachedThreshold={0.5}
				onEndReached={loadMoreDataPost}
				onRefresh={onRefresh}
				removeClippedSubviews={true}
				windowSize={12}
				getItemLayout={(data, index) => ({
					index,
					length: ITEM_HEIGHT,
					offset: ITEM_HEIGHT * index
				})}
				columnWrapperStyle={{
					gap: 2,
					paddingVertical: 1,
				}}
				renderItem={({ item, index }) => (
					<ProfileGridItem item={item} index={index} />
				)}
				ListHeaderComponent={loadingUser !== "normal" ? <View /> : <ProfileHeader
					userData={dataUser}
					isProfile={isProfile} />}

				ListEmptyComponent={() => {
					if (errorUser || errorPost && loadingUser === "normal") {
						return <ErrorScreen message={errorUser} />;
					}
					if (loadingPost === "normal" && loadingUser === "normal") {
						return <ProfileEmptyPosts />;
					}
					return <View />
				}}
				ListFooterComponent={() => {
					if (loadingUser !== "normal" || loadingPost !== "normal") {
						return <View style={{
							width: '100%',
							height: 50,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<Loader size={40} />
						</View>
					}
					return <View />;
				}}
			/>}
		</View>
	)
}

export default ProfilePage;