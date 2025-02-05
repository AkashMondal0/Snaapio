import { Text, useTheme } from "hyper-native-ui";
import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";

const AITextLoader = ({
  text = "Generating response...",
  speed = 30,
  onComplete,
}: {
  text?: string;
  speed?: number;
  onComplete?: VoidFunction;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const textRef = useRef(""); // Keeps track of actual text being displayed
  const { currentTheme } = useTheme();
  const dotOpacity = useSharedValue(0);

  useEffect(() => {
    setDisplayedText(""); // Reset text
    textRef.current = ""; // Reset reference

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        textRef.current += text[index]; // Update ref first
        setDisplayedText(textRef.current); // Use ref for accurate updates
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  useEffect(() => {
    dotOpacity.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.3, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      withDelay(500, withTiming(0, { duration: 200 }))
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
      }}
    >
      <Text>{displayedText}</Text>
      <Animated.Text
        style={[
          {
            fontSize: 18,
            fontWeight: "bold",
            color: currentTheme.foreground,
            marginLeft: 4,
          },
          dotStyle,
        ]}
      >
        {"."}
      </Animated.Text>
    </View>
  );
};

export default AITextLoader;
