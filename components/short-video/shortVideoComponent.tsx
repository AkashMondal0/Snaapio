import { useCallback, useEffect, useRef, useState } from "react";
import { Post } from "@/types";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Icon } from "@/components/skysolo-ui";
import { configs } from "@/configs";
import { ResizeMode, Video } from "expo-av";
import ShortVideoActionButton from "./shortVideoActionButton";
import { useTheme } from "hyper-native-ui";

const ShortVideoComponent = ({
    data,
    navigateToProfile,
}: {
    data: Post;
    navigateToProfile: () => void;
}) => {
    const { themeScheme } = useTheme();
    const [muted, setMuted] = useState(false);
    const [paused, setPaused] = useState(false);
    const navigation = useNavigation();
    const videoRef = useRef<Video>(null);

    const fullUrl = configs.serverApi.supabaseStorageUrl + data?.fileUrl?.[0]?.shortVideoUrl;

    const handlePlayPause = useCallback(() => {
        setPaused((prev) => {
            const next = !prev;
            try {
                if (videoRef.current) {
                    next ? videoRef.current.pauseAsync() : videoRef.current.playAsync();
                }
            } catch (e) {
                console.warn('Play/pause toggle failed:', e);
            }
            return next;
        });
    }, []);

    const navigateToBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, []);

    // Apply mute when state changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.setIsMutedAsync(muted);
        }
    }, [muted]);

    // Handle screen focus: resume/pause
    useFocusEffect(
        useCallback(() => {
            if (videoRef.current && !paused) {
                videoRef.current.playAsync();
            }

            return () => {
                videoRef.current?.pauseAsync();
            };
        }, [paused])
    );
    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused
            // console.log('Screen is focused');
            StatusBar.setBarStyle("light-content");

            return () => {
                // Cleanup if needed when the screen is unfocused
                // console.log('Screen is unfocused');
                StatusBar.setBarStyle(themeScheme === "dark" ? "light-content" : "dark-content");
            };
        }, [themeScheme])
    );

    useEffect(() => {
        return () => {
            videoRef.current?.pauseAsync();
        };
    }, []);

    return (
        <>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    margin: 8,
                    marginTop: StatusBar.currentHeight ?? 0 + 20,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: 50,
                    zIndex: 100,
                    padding: 4
                }}
                onPress={navigateToBack}
            >
                <Icon
                    onPress={navigateToBack}
                    iconName={"ArrowLeft"}
                    size={38}
                    color="white"
                />
            </TouchableOpacity>
            {/*  */}
            <View style={styles.container}>
                {/* back Button */}
                <TouchableWithoutFeedback onPress={handlePlayPause}>
                    <Video
                        ref={videoRef}
                        source={{ uri: fullUrl }}
                        style={styles.video}
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={!paused}
                        isMuted={muted}
                        isLooping
                    />
                </TouchableWithoutFeedback>

                {/* Mute Button */}
                <TouchableOpacity
                    style={styles.muteButton}
                    onPress={() => setMuted((m) => !m)}
                >
                    <Icon
                        onPress={() => setMuted((m) => !m)}
                        iconName={muted ? 'VolumeOff' : 'Volume2'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                {/* Play/Pause Button */}
                <TouchableOpacity
                    style={[styles.muteButton, { top: 100 }]}
                    onPress={handlePlayPause}
                >
                    <Icon
                        onPress={handlePlayPause}
                        iconName={paused ? 'Play' : 'Pause'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                {/* Action Buttons */}
                <ShortVideoActionButton item={data} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        width: "100%",
        height: "100%",
    },
    video: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    muteButton: {
        position: "absolute",
        top: 50,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    textContent: {
        padding: 10,
        borderRadius: 10,
        width: "80%",
    },
    sideButtons: {
        position: "absolute",
        bottom: 0,
        right: 0,
        gap: 26,
        padding: 16,
        paddingVertical: 40,
        alignItems: "center",
    },
});

export default ShortVideoComponent;