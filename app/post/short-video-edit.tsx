import React, { useState, useRef, useEffect, memo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { View, Animated, PanResponder, Dimensions, ToastAndroid } from 'react-native';
import { Button, Input, PressableButton, Text, useTheme } from "hyper-native-ui";
import { useVideoPlayer, VideoView } from 'expo-video';
import { Icon } from '@/components/skysolo-ui';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { uploadVideoApi } from '@/redux-stores/slice/account/api.service';
import { ShortVideoTypes } from '@/types';
import { hapticVibrate } from '@/lib/RN-vibration';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const markerWidth = 10;
const min_trim_duration = 4;
// const end_Second = 20;

const schema = z.object({
    title: z.string(),
    // .nonempty({ message: "Title is required" }),
    caption: z.string()
    // .min(0, { message: "caption must be at least 4 characters" })
    // .nonempty({ message: "caption is required" })
})

const ShortVideoEditScreen = memo(function ShortVideoEditScreen({ route }: {
    route: {
        params: {
            assets: MediaLibrary.Asset[]
        }
    }
}) {
    const localVideo = route?.params?.assets?.[0];
    const length_limit = 43;

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { currentTheme } = useTheme();

    const video_bar_width = SCREEN_WIDTH - 40;
    const video_duration = localVideo?.duration ?? 0;

    const [startSecond, setStartSecond] = useState(0);
    const [muted, setMuted] = useState(false);
    const [videoResize, setVideoResize] = useState(false);
    const [endSecond, setEndSecond] = useState(video_duration > 40 ? 40 : video_duration);
    const [isPlaying, setIsPlaying] = useState(true);

    const startAnimation = useRef(new Animated.Value(0)).current;
    const endAnimation = useRef(new Animated.Value(0)).current;

    const videoSource = localVideo?.uri && { uri: localVideo.uri };

    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
        player.currentTime = 0;
        player.play();
    });
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<any>(null);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            caption: '',
        },
        resolver: zodResolver(schema)
    });

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
        onPanResponderStart: () => hapticVibrate(),
        onPanResponderMove: (_, gestureState) => {
            if (loading) return;
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

    const toggleMute = () => {
        setMuted((pre) => !pre);
        if (player) {
            player.muted = !muted;
        }
    };

    const toggleVideoResize = () => {
        setVideoResize((pre) => !pre);
    };

    const handleUpload = async (data: {
        title: string,
        caption: string,
    }) => {
        player.pause();
        const _data: ShortVideoTypes = {
            start: Number(startSecond.toFixed(2)),
            end: Number(endSecond.toFixed(2)),
            muted: muted,
            resize: videoResize ? "contain" : "cover",
            title: data.title,
            caption: data.caption,
            file: localVideo
        };
        setLoading(true);
        await dispatch(uploadVideoApi(_data as any) as any);
        ToastAndroid.show('Video Uploaded', ToastAndroid.SHORT);
        navigation.goBack();
        setLoading(false);
    }

    return (
        <KeyboardAwareScrollView ScrollViewComponent={ScrollView}
            keyboardShouldPersistTaps='handled'>
            {/* header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
                <View>
                    {navigation.canGoBack() ? <Icon
                        disabled={loading}
                        iconName="ArrowLeft"
                        size={30}
                        style={{
                            aspectRatio: 1,
                            width: 40,
                        }}
                        onPress={() => {
                            navigation.goBack()
                        }}
                        isButton /> : <></>}
                </View>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>
                    Video
                </Text>
                <Text style={{
                    fontSize: 14,
                    marginBottom: 16,
                    textAlign: 'center',
                }}>{convertMinutesToTime(localVideo.duration)}</Text>
            </View>
            {/* video component */}
            <VideoView
                style={{
                    width: "80%",
                    aspectRatio: 9 / 16,
                    borderRadius: 20,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: currentTheme.border,
                    marginHorizontal: "auto"
                }}
                player={player}
                allowsFullscreen={false}
                nativeControls={false}
                allowsPictureInPicture={false}
                contentFit={videoResize ? "contain" : "cover"}
            />
            <View style={{
                flexDirection: 'row',       // Arrange buttons in a row
                justifyContent: 'center',   // Center the buttons horizontally
                alignItems: 'center',       // Align them vertically
                marginVertical: 14,
                width: "100%",
                gap: 12                     // Add space between buttons (RN 0.71+)
            }}>
                <PressableButton style={{ padding: 10, borderRadius: 100 }}
                    disabled={loading}
                    radius={100} onPress={togglePlayPause}>
                    <Icon
                        disabled={loading}
                        iconName={isPlaying ? 'Pause' : 'Play'}
                        size={30}
                        onPress={togglePlayPause}
                    />
                </PressableButton>
                <PressableButton style={{ padding: 10, borderRadius: 100 }}
                    disabled={loading}
                    radius={100} onPress={togglePlayPause}>
                    <Icon
                        disabled={loading}
                        iconName={!muted ? 'Volume2' : 'VolumeOff'}
                        size={30}
                        onPress={toggleMute}
                    />
                </PressableButton>
                <PressableButton style={{ padding: 10, borderRadius: 100 }}
                    disabled={loading}
                    radius={100} onPress={toggleVideoResize}>
                    <Icon
                        disabled={loading}
                        iconName={!videoResize ? 'X' : 'Scan'}
                        size={30}
                        onPress={toggleVideoResize}
                    />
                </PressableButton>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
                paddingHorizontal: 30
            }}>
                <Text>Start: {convertMinutesToTime(startSecond)}</Text>
                <Text>End: {convertMinutesToTime(endSecond)}</Text>
            </View>
            {/* rang */}
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <View style={{
                    width: video_bar_width,
                    height: 60,
                    backgroundColor: currentTheme.input,
                    borderRadius: 8,
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
                            // backgroundColor: currentTheme.chart_1, //TODO add your color
                            zIndex: 1,
                            left: startAnimation,
                            width: Animated.subtract(endAnimation, startAnimation),
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
                <View style={{
                    marginVertical: 10,
                    paddingHorizontal: 30,
                    marginLeft: "auto"
                }}>
                    <Text>{convertMinutesToTime(localVideo.duration)}</Text>
                </View>
            </View>
            {/* input and button */}
            <View style={{ paddingHorizontal: 14 }}>
                <Text style={{
                    marginBottom: 16,
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                }}>
                    Details
                </Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            disabled={loading}
                            style={{ width: "90%" }}
                            isErrorBorder={errors.title}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder='Title'
                            textContentType='name'
                            keyboardType="default"
                            returnKeyType="next"
                            onSubmitEditing={() => inputRef.current?.focus()}
                            blurOnSubmit={false} />
                    )}
                    name="title"
                    rules={{ required: true }} />
                <Text
                    variant="body1"
                    variantColor="Red"
                    style={{
                        fontSize: 12,
                        textAlign: "left",
                        fontWeight: 'bold',
                        margin: 4,
                    }}>
                    {errors.title?.message}
                </Text>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            ref={inputRef}
                            onSubmitEditing={handleSubmit(handleUpload)}
                            blurOnSubmit={false}
                            disabled={loading}
                            style={{ width: "82%" }}
                            isErrorBorder={errors.caption}
                            placeholder='caption'
                            textContentType="name"
                            returnKeyType="done"
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                        />
                    )}
                    name="caption"
                    rules={{ required: true }} />
                <Text
                    variant="body1"
                    variantColor="Red"
                    style={{
                        fontSize: 12,
                        textAlign: "left",
                        fontWeight: 'bold',
                        margin: 4,
                        marginBottom: 20,
                    }}>
                    {errors.caption?.message}
                </Text>
                <Button onPress={handleSubmit(handleUpload)} disabled={loading} loading={loading}>
                    Upload
                </Button>
                <View style={{ height: 18 }} />
            </View>
        </KeyboardAwareScrollView>
    );
});

export default ShortVideoEditScreen;

function convertMinutesToTime(mins: number) {
    const totalSeconds = Math.floor(mins * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
