import React, { useState, useRef, useEffect, memo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { View, Animated, PanResponder, Dimensions, ScrollView } from 'react-native';
import { Button, Text, useTheme } from "hyper-native-ui";
import { useVideoPlayer, VideoView } from 'expo-video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const markerWidth = 14;
const min_trim_duration = 4;
const end_Second = 20;
const length_limit = 40;

const ShortVideoEditScreen = memo(function ShortVideoEditScreen({ route }: {
    route: {
        params: {
            assets: MediaLibrary.Asset[]
        }
    }
}) {
    const localVideo = route?.params?.assets?.[0];
    const { currentTheme } = useTheme();

    const video_bar_width = SCREEN_WIDTH - 40;
    const video_duration = localVideo?.duration ?? 0;

    const [startSecond, setStartSecond] = useState(0);
    const [muted, setMuted] = useState(0);
    const [endSecond, setEndSecond] = useState(localVideo.duration ?? 0);
    const [isPlaying, setIsPlaying] = useState(true);

    const startAnimation = useRef(new Animated.Value(0)).current;
    const endAnimation = useRef(new Animated.Value(0)).current;

    const videoSource = localVideo?.uri
        ? { uri: localVideo.uri }
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
        player.currentTime = 0;
        player.play();
    });

    // player.muted = true

    // Keep video inside trimmed bounds
    useEffect(() => {
        const interval = setInterval(() => {
            if (player && isPlaying) {
                if (player.currentTime >= endSecond) {
                    player.currentTime = startSecond;
                }
            }
        }, 250);

        return () => clearInterval(interval);
    }, [player, startSecond, endSecond, isPlaying]);

    // Seek to startSecond when updated
    useEffect(() => {
        if (player) {
            player.currentTime = startSecond;
        }
    }, [startSecond]);

    // Animate markers
    useEffect(() => {
        const updateMarkers = () => {
            startAnimation.setValue((startSecond / video_duration) * (video_bar_width - markerWidth));
            endAnimation.setValue((endSecond / video_duration) * (video_bar_width - markerWidth));
        };
        updateMarkers();
    }, [startSecond, endSecond]);

    const createPanResponder = (isStart: boolean) => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const secondsPerPixel = video_duration / (video_bar_width - markerWidth);
            const delta = gestureState.dx * secondsPerPixel;

            if (isStart) {
                const newStart = Math.max(0, Math.min(endSecond - min_trim_duration, startSecond + delta));
                if ((endSecond - newStart) <= length_limit) {
                    setStartSecond(newStart);
                }
            } else {
                const newEnd = Math.min(video_duration, Math.max(startSecond + min_trim_duration, endSecond + delta));
                if ((newEnd - startSecond) <= length_limit) {
                    setEndSecond(newEnd);
                }
            }
        },
    });

    const startPanResponder = createPanResponder(true);
    const endPanResponder = createPanResponder(false);

    const togglePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleUpload = () => {
        console.log(`Trimming from ${startSecond.toFixed(2)}s to ${endSecond.toFixed(2)}s`);
        // Add trimming logic here
    };

    return (
        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 20,
                textAlign: 'center',
            }}>
                Video
            </Text>

            <VideoView
                style={{ aspectRatio: 9 / 16, borderRadius: 20 }}
                player={player}
                allowsFullscreen={false}
                nativeControls={false}
                allowsPictureInPicture={false}
            />

            <View style={{ alignItems: 'center', marginVertical: 30 }}>
                <View style={{
                    width: video_bar_width,
                    height: 60,
                    backgroundColor: currentTheme.input,
                    borderRadius: 12,
                    overflow: 'hidden',
                    justifyContent: 'center',
                }}>
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: markerWidth,
                            height: 60,
                            borderRadius: markerWidth / 2,
                            top: 0,
                            zIndex: 2,
                            backgroundColor: currentTheme.primary,
                            transform: [{ translateX: startAnimation }]
                        }}
                        {...startPanResponder.panHandlers}
                    />
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: markerWidth,
                            height: 60,
                            borderRadius: markerWidth / 2,
                            top: 0,
                            zIndex: 2,
                            backgroundColor: currentTheme.primary,
                            transform: [{ translateX: endAnimation }]
                        }}
                        {...endPanResponder.panHandlers}
                    />
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            height: 60,
                            borderRadius: 12,
                            // backgroundColor: currentTheme.ring,
                            zIndex: 1,
                            left: startAnimation,
                            width: Animated.subtract(endAnimation, startAnimation),
                            // backgroundImage:localVideo.uri
                        }}
                    >
                        {/* <Image
                            source={{ uri: localVideo.uri }}
                            style={{
                                height: 60,
                                width: "100%"
                            }}
                            resizeMode="repeat"
                        /> */}
                    </Animated.View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text>Start: {startSecond.toFixed(2)}s</Text>
                <Text>End: {endSecond.toFixed(2)}s</Text>
            </View>

            <Button onPress={togglePlayPause} style={{ marginBottom: 10 }}>
                {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button onPress={handleUpload}>
                Trim Video
            </Button>
        </ScrollView>
    );
});

export default ShortVideoEditScreen;
