import React from "react";
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, Vibration } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import RNvibrate, { hapticVibrate } from "@/lib/RN-vibration";
import vibrate from "@/lib/RN-vibration";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const VIDEO_WIDTH = SCREEN_WIDTH * 0.4; // 40% of screen width
const VIDEO_HEIGHT = (VIDEO_WIDTH * 9) / 16; // 16:9 Aspect Ratio
const PADDING = 20; // Space from edges
const SNAP_BOTTOM = SCREEN_HEIGHT - VIDEO_HEIGHT - PADDING; // Bottom snap position

const DraggableVideo = () => {
  // 🟢 Reanimated Shared Values for smooth animation
  const translateX = useSharedValue(SCREEN_WIDTH - VIDEO_WIDTH - PADDING);
  const translateY = useSharedValue(PADDING);

  // 🟢 Gesture Handling with Reanimated & Gesture Handler
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      // Set initial touch point so movement aligns properly
      translateX.value = event.absoluteX - VIDEO_WIDTH / 2;
      translateY.value = event.absoluteY - VIDEO_HEIGHT / 2;
    })
    .onUpdate((event) => {
      // Apply a scaling factor (0.5) to slow down movement
      translateX.value = (event.translationX * 0.0) + event.absoluteX - VIDEO_WIDTH / 2;
      translateY.value = (event.translationY * 0.0) + event.absoluteY - VIDEO_HEIGHT / 2;
    })
    .onEnd((event) => {
      const snapToLeft = event.absoluteX < SCREEN_WIDTH / 2;
      const snapToTop = event.absoluteY < SCREEN_HEIGHT / 2;

      const finalX = snapToLeft ? PADDING : SCREEN_WIDTH - VIDEO_WIDTH - PADDING;
      const finalY = snapToTop ? PADDING : SNAP_BOTTOM;

      // 🟢 Smooth Spring Snap with Slower Movement
      translateX.value = withSpring(finalX, { damping: 20, stiffness: 120 });
      translateY.value = withSpring(finalY, { damping: 20, stiffness: 120 });
    });

  // 🟢 Animated Style for the Video Component
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.video, animatedStyle]}>
          <TouchableOpacity style={styles.videoContent} onPressIn={hapticVibrate}>
            <View >
              <Text style={styles.videoText}>🎥 Video Player</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  video: {
    position: "absolute",
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: "black",
    borderRadius: 10,
    overflow: "hidden",
  },
  videoContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoText: {
    color: "white",
    fontSize: 16,
  },
});

export default DraggableVideo;
