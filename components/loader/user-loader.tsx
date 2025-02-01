import { Skeleton } from "hyper-native-ui"
import React from "react"
import { View } from "react-native"


const UserItemLoader = ({ size }: { size?: number }) => {
	return <>
		{Array(size ?? 8).fill(0).map((_, i) => <View
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
				<Skeleton width={60} height={60} borderRadius={120} />
				<View style={{
					gap: 8,
				}}>
					<Skeleton width={120} height={12} />
					<Skeleton width={70} height={10} />
				</View>
			</View>
			<Skeleton width={80} height={40} />
		</View>)}
	</>
}

export default UserItemLoader;