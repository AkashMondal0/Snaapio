import { ThemedView } from 'hyper-native-ui';
import React from 'react'
import { Image } from 'react-native'

function SplashComponent() {
	return (
		<ThemedView style={{
			flex: 1,
			height: "100%",
			width: "100%",
			justifyContent: "center",
			alignItems: "center"
		}}>
			<Image
				style={{
					width: 200,
					height: 200,
				}}
				source={require('../assets/adaptive-icon.png')}
			/>
		</ThemedView>
	)
}

export default SplashComponent;