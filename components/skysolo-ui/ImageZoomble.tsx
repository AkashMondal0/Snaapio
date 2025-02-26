
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated';
import {
	GestureHandlerRootView,
	PinchGestureHandler,
} from 'react-native-gesture-handler';

const ZoomableImage = () => {
	const scale = useSharedValue(1); // Scale state

	// Gesture Handler
	const pinchHandler: any = useAnimatedGestureHandler({
		onActive: (event: any) => {
			scale.value = Math.max(1, Math.min(event.scale, 3)); // Restrict scale
		},
		onEnd: () => {
			scale.value = withSpring(1); // Reset smoothly
		},
	});

	// Animated Style
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<GestureHandlerRootView style={styles.container}>
			<PinchGestureHandler onGestureEvent={pinchHandler}>
				<Animated.View style={styles.animatedContainer}>
					<Animated.Image
						source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Freya_Allan_by_Gage_Skidmore.jpg/170px-Freya_Allan_by_Gage_Skidmore.jpg' }}
						style={[styles.image, animatedStyle]}
						resizeMode="contain"
					/>
				</Animated.View>
			</PinchGestureHandler>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	animatedContainer: {
		width: 300,
		height: 300,
	},
	image: {
		width: '100%',
		height: '100%',
	},
});

export default ZoomableImage;
