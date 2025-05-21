import React, { useCallback, useState } from 'react';
import {
	View,
	TouchableOpacity,
} from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { Avatar, Icon } from '@/components/skysolo-ui';
import { useGQMutation } from '@/lib/useGraphqlQuery';
import { Post } from '@/types';
import { Text } from 'hyper-native-ui';
import { Heart } from 'lucide-react-native';
import { QPost } from '@/redux-stores/slice/post/post.queries';
import useDebounce from '@/lib/debouncing';
import useAppState from '@/hooks/AppState';
import { useDispatch } from 'react-redux';
import { setShareSheetData } from '@/redux-stores/slice/dialog';
import { FeedItemContent } from '../post';

function ShortVideoActionButton({
	item,
}: { item: Post }) {
	const { handleSnapPress } = useAppState();
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [like, setLike] = useState({
		isLike: item.is_Liked,
		likeCount: item.likeCount
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
		if (!item?.id) return;
		mutate({ input: { id: item?.id, like: value, recipientId: item.user.id, postUrl: item.fileUrl[0].shortVideoThumbnail } });
	}, [item?.id])

	const debounceLike = useDebounce(delayLike, 500)

	const onLike = useCallback(() => {
		setLike((pre) => ({
			isLike: !pre.isLike,
			likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
		}))
		debounceLike(!like.isLike)
	}, [like.isLike, like.likeCount])

	const navigateToProfile = useCallback(() => {
		navigation.dispatch(StackActions.push("Profile", { id: item.user?.id }))
	}, [item.user?.id])

	const handleShare = useCallback(() => {
		dispatch(setShareSheetData(item))
		handleSnapPress(0)
	}, [item?.id])

	return <View style={{
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: '100%',
		justifyContent: "flex-end",
	}}>
		<View style={{
			marginHorizontal: "2%",
			display: 'flex',
			flexDirection: "column",
			gap: 6,
			marginBottom: 20
		}}>
			{item.title ? <Text variant="body1" style={{ marginHorizontal: "2%", color: "white" }}>{item.title}</Text> : <></>}
			{item.content ? <FeedItemContent data={item} showUserName={false} textSecondaryColor={false} textColor={"white"} /> : <></>}
		</View>
		{/* avatar */}
		<View style={{
			marginHorizontal: "2%",
			paddingBottom: "4%",
			display: 'flex',
			flexDirection: "row",
			alignItems: "center",
			gap: 6
		}}>
			<Avatar size={52} url={item.user?.profilePicture} onPress={navigateToProfile} />
			<View>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={navigateToProfile}>
					<Text style={{ fontWeight: "600", color: "white" }}>
						{item?.user?.name}
					</Text>
				</TouchableOpacity>
				<Text
					style={{ fontWeight: "400", color: "white" }}
					variantColor="secondary"
					variant="body2">
					{`india, kolkata`}
				</Text>
			</View>
		</View>
		{/* side button */}
		<View style={{
			position: 'absolute',
			bottom: 0,
			right: 0,
			gap: 26,
			padding: 16,
			paddingVertical: 40,
			alignItems: 'center',
		}}>
			<View>
				{!like.isLike ? <Icon color="white" iconName={"Heart"} size={32} onPress={onLike} /> :
					<Heart size={32} fill={like.isLike ? "red" : ""} onPress={onLike} color="white" />}
				<TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("PostLike", { id: item.id })}>
					<Text style={{
						textAlign: "center", marginTop: 6, fontSize: 16,
						fontWeight: "600", color: "white"
					}}>
						{like.likeCount}
					</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity activeOpacity={1} onPress={() => {
				navigation.dispatch(StackActions.push("PostComment", { id: item.id }))
			}}>
				<Icon iconName="MessageCircle" size={32} color="white" onPress={() => {
					navigation.dispatch(StackActions.push("PostComment", { id: item.id }))
				}} />
				<Text style={{
					textAlign: "center", marginTop: 6, fontSize: 16,
					fontWeight: "600",
					color: "white"
				}}>
					{item.commentCount}
				</Text>
			</TouchableOpacity>
			<Icon iconName="Send" size={32} color="white" onPress={handleShare} />
			<Icon iconName="Bookmark" size={32} color="white" />
			<Icon iconName="MoreHorizontal" size={32} color="white" />
		</View>
	</View>;
}

export default ShortVideoActionButton;
