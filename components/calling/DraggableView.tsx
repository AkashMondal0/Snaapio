import React, { ReactNode } from "react";
import { Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const VIDEO_WIDTH = SCREEN_WIDTH * 0.3;
const VIDEO_HEIGHT = (VIDEO_WIDTH * 5) / 3;
const PADDING = 10;
const SNAP_BOTTOM = SCREEN_HEIGHT - VIDEO_HEIGHT - PADDING;

const DraggableView = ({ position = "topRight", children }: { position: "topRight" | "topLeft" | "bottomRight" | "bottomLeft", children: ReactNode }) => {
	// Initial Position
	const initialX = position.includes("Left") ? PADDING : SCREEN_WIDTH - VIDEO_WIDTH - PADDING;
	const initialY = position.includes("top") ? PADDING : SNAP_BOTTOM;

	// 🟢 Reanimated Shared Values
	const translateX = useSharedValue(initialX);
	const translateY = useSharedValue(initialY);
	const scale = useSharedValue(1); // Default scale

	// 🟢 Gesture Handling
	const panGesture = Gesture.Pan()
		.onStart(() => {
			scale.value = withSpring(1.5, { damping: 10, stiffness: 100 }); // 🟢 Increase size even more
		})
		.onUpdate((event) => {
			translateX.value = event.absoluteX - VIDEO_WIDTH / 2;
			translateY.value = event.absoluteY - VIDEO_HEIGHT / 2;
		})
		.onEnd((event) => {
			const snapToLeft = event.absoluteX < SCREEN_WIDTH / 2;
			const snapToTop = event.absoluteY < SCREEN_HEIGHT / 2;

			const finalX = snapToLeft ? PADDING : SCREEN_WIDTH - VIDEO_WIDTH - PADDING;
			const finalY = snapToTop ? PADDING : SNAP_BOTTOM;

			translateX.value = withSpring(finalX, { damping: 20, stiffness: 120 });
			translateY.value = withSpring(finalY, { damping: 20, stiffness: 120 });

			scale.value = withSpring(1, { damping: 10, stiffness: 100 }); // 🟢 Reset to normal size
		});

	// 🟢 Animated Style
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
			{ scale: scale.value },
		],
	}));

	return (
		<GestureDetector gesture={panGesture}>
			<Animated.View style={[{
				position: "absolute",
				width: VIDEO_WIDTH,
				height: VIDEO_HEIGHT,
				borderRadius: 10,
				overflow: "hidden",
			}, animatedStyle]}>
				{children}
			</Animated.View>
		</GestureDetector>
	);
};

export default DraggableView;
