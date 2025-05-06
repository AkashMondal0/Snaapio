import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native';

// const markerWidth = 16; // width of both start and end markers
// const min_trim_duration = 4;
// const video_duration = 60;
// const video_bar_width = SCREEN_WIDTH - 40; // padding from both sides
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VideoTrimmer = ({
    markerWidth = 10,
    min_trim_duration = 4,
    video_bar_width = SCREEN_WIDTH - 40,
    video_duration = 100,
    end_Second = 20,
    length_limit = 40
}: {
    markerWidth?: number
    min_trim_duration?: number
    video_duration?: number
    width?: number
    video_bar_width?: number
    end_Second?: number
    length_limit?: number
}) => {
    const [startSecond, setStartSecond] = useState(0);
    const [endSecond, setEndSecond] = useState(end_Second);
    const startAnimation = useRef(new Animated.Value(0)).current;
    const endAnimation = useRef(new Animated.Value(video_bar_width * (50 / video_duration))).current;

    // const handleTrim = () => {
    //     console.log(`Trimming video from ${startSecond.toFixed(2)}s to ${endSecond.toFixed(2)}s`);
    //     // Add your trimming logic here
    // };

    useEffect(() => {
        startAnimation.setValue((startSecond / video_duration) * (video_bar_width - markerWidth));
        endAnimation.setValue((endSecond / video_duration) * (video_bar_width - markerWidth));
    }, [startSecond, endSecond]);

    const createPanResponder = (isStart: any) => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            const secondsPerPixel = video_duration / (video_bar_width - markerWidth);
            const delta = gestureState.dx * secondsPerPixel;

            if (isStart) {
                const newStart = Math.max(0, Math.min(endSecond - min_trim_duration, startSecond + delta));
                if ((endSecond - newStart) > length_limit) { // check upload limit
                    console.warn('Cannot select more than 40 seconds!');
                    return;
                }
                setStartSecond(newStart);
            } else {
                const newEnd = Math.min(video_duration, Math.max(startSecond + min_trim_duration, endSecond + delta));
                if ((newEnd - startSecond) > length_limit) { // check upload limit
                    console.warn('Cannot select more than 40 seconds!');
                    return;
                }
                setEndSecond(newEnd);
            }
        },
    });

    const startPanResponder = createPanResponder(true);
    const endPanResponder = createPanResponder(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Video Trimmer</Text>
            <View style={styles.videoContainer}>
                <View style={{
                    width: video_bar_width,
                    height: 60,
                    backgroundColor: '#eee',
                    borderRadius: 12,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    position: 'relative',
                }}>
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                width: markerWidth,
                                height: 60,
                                borderRadius: markerWidth / 2,
                                top: 0,
                                zIndex: 2,
                            },
                            styles.startMarker,
                            {
                                transform: [{
                                    translateX: startAnimation
                                }]
                            }
                        ]}
                        {...startPanResponder.panHandlers}
                    />
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                width: markerWidth,
                                height: 60,
                                borderRadius: markerWidth / 2,
                                top: 0,
                                zIndex: 2,
                            },
                            styles.endMarker,
                            {
                                transform: [{
                                    translateX: endAnimation
                                }]
                            }
                        ]}
                        {...endPanResponder.panHandlers}
                    />
                    <Animated.View
                        style={[
                            styles.selection,
                            {
                                left: startAnimation,
                                width: Animated.subtract(endAnimation, startAnimation),
                            }
                        ]}
                    />
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Start: {startSecond.toFixed(2)}s</Text>
                <Text style={styles.label}>End: {endSecond.toFixed(2)}s</Text>
            </View>
            {/* <Button title="Trim Video" onPress={handleTrim} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    videoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    startMarker: {
        backgroundColor: 'green',
    },
    endMarker: {
        backgroundColor: 'red',
    },
    selection: {
        position: 'absolute',
        top: 0,
        height: 60,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 150, 255, 0.3)',
        zIndex: 1,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
    },
});


export default VideoTrimmer;