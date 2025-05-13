import { memo, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Post } from '@/types';
import { Text } from 'hyper-native-ui';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const FeedItemContent = memo(function FeedItemContent({ data,
	showUserName = true,
	textSecondaryColor = true
}: {
	data: Post,
	showUserName?: boolean,
	textSecondaryColor?: boolean
}) {
	const navigation = useNavigation();
	const [readMore, setReadMore] = useState(false)

	if (data.content.length <= 0) {
		return <></>
	}
	return (<Text numberOfLines={readMore ? 100 : 3}
		style={{
			alignItems: "center",
			marginHorizontal: "2%",
		}}
		ellipsizeMode="tail">
		{showUserName ? <TouchableWithoutFeedback
			style={{
				borderWidth: 0.5,
				borderColor: "red",
			}}
			onPress={() => {
				navigation.navigate("Profile", { id: data.user.username })
			}}>
			<Text
				style={{
					fontWeight: "500",
					fontSize: 16
				}}
				lineBreakMode="clip" numberOfLines={2}>
				{data.user.name}{" "}
			</Text>
		</TouchableWithoutFeedback> : <></>}
		<TouchableWithoutFeedback onPress={() => setReadMore(!readMore)}>
			<Text
				variantColor={textSecondaryColor ? 'secondary' : "default"}
				style={{
					marginHorizontal: "2%",
					fontWeight: "400",
					paddingVertical: 5,
					fontSize: 14
				}}
				numberOfLines={readMore ? 100 : 2}>
				{data.content}
			</Text>
		</TouchableWithoutFeedback>
	</Text>)
}, () => true);

export default FeedItemContent;