import { Loader2 } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const RotationAnimation = ({ color }: { color: string }) => {
    const rotation = useRef(new Animated.Value(0)).current; // Initial value for rotation: 0

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 2,
                duration: 2000,
                useNativeDriver: true, // Add This line
            }),
        ).start();
    }, [rotation]);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ rotate: spin }] }} >
                <Loader2 color={color} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RotationAnimation;