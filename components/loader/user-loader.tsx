import { useTheme } from "hyper-native-ui";
import React from "react"
import { View } from "react-native"


const UserItemLoader = ({ size }: { size?: number }) => {
	const { currentTheme } = useTheme();
	const background = currentTheme.input
	return <>
		{Array(size ?? 12).fill(0).map((_, i) => <View
			key={i}
			style={{
				flexDirection: 'row',
				padding: 12,
				alignItems: 'center',
				width: '100%',
				gap: 10,
				marginVertical: 2,
				justifyContent: 'space-between',
			}}>
			<View style={{
				display: 'flex',
				flexDirection: 'row',
				gap: 10,
				alignItems: 'center',
			}}>
				<View
					style={{
						width: 60,
						height: 60,
						borderRadius: 120,
						backgroundColor: background
					}} />
				<View style={{
					gap: 8,
				}}>
					<View style={{
						width: 120,
						height: 12,
						borderRadius: 120,
						backgroundColor: background
					}} />
					<View style={{
						width: 70,
						height: 10,
						borderRadius: 120,
						backgroundColor: background
					}} />
				</View>
			</View>
			<View style={{
				width: 80,
				height: 40,
				borderRadius: 10,
				backgroundColor: background
			}} />
		</View>)}
	</>
}

export default UserItemLoader;