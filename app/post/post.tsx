import { memo, useCallback, useEffect, useState } from "react";
import { Post } from "@/types";
import AppHeader from "@/components/AppHeader";
import { FeedItem } from "@/components/home";
import ErrorScreen from "@/components/error/page";
import {
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import { StaticScreenProps, useFocusEffect } from "@react-navigation/native";
import { useGQObject } from "@/lib/useGraphqlQuery";
import { QPost } from "@/redux-stores/slice/post/post.queries";
import { Icon } from "@/components/skysolo-ui";
import { useVideoPlayer, VideoView } from "expo-video";
import { configs } from "@/configs";
import { ActionButtonShort } from "../HomeTab/reels";
import { Loader } from "hyper-native-ui";

type Props = StaticScreenProps<{
    id: string;
}>;

const PostScreen = memo(function PostScreen({ route }: Props) {
    const postId = route.params.id;

    const { data, error, loading } = useGQObject<Post>({
        query: QPost.findOnePost,
        variables: { id: postId }
    });

    if (loading !== "normal" && !data) {
        return (
            <View style={{
                flex: 1, width: "100%", height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Loader size={40} />
            </View>
        );
    }

    if (error && loading !== "normal") {
        return <ErrorScreen />;
    }

    if (data?.type === "short") {
        return <ShortVideoComponent data={data} navigateToProfile={() => { }} />;
    }
     

    return (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <AppHeader title="Post" titleCenter />
            <ScrollView>
                {data ? <FeedItem data={data} /> : null}
            </ScrollView>
        </View>
    );
});

export default PostScreen;

const ShortVideoComponent = ({
    data,
    navigateToProfile,
}:{
    data: Post;
    navigateToProfile: () => void;
}) => {
    const [muted, setMuted] = useState(false);
    const [paused, setPaused] = useState(false);
    const fullUrl = `${configs.serverApi.supabaseStorageUrl}`.replace(
        "/snaapio-production/",
        "/"
    ) + data?.fileUrl[0].shortVideoUrl;

    const player = useVideoPlayer(fullUrl, (p) => {
        p.loop = true;
        p.muted = muted;
        try {
            p.play();
        } catch (e) {
            console.warn("Initial play failed:", e);
        }
    });

    // Apply mute to player when state changes
    useEffect(() => {
        try {
            if (player) {
                player.muted = muted;
            }
        } catch (e) {
            console.warn("Mute update failed:", e);
        }
    }, [muted, player]);

    const handlePlayPause = () => {
        setPaused((prev) => {
            const next = !prev;
            try {
                if (player) {
                    next ? player.pause?.() : player.play?.();
                }
            } catch (e) {
                console.warn("Play/pause toggle failed:", e);
            }
            return next;
        });
    }

    // Handle focus lifecycle (play/pause)
    useFocusEffect(
        useCallback(() => {
            try {
                if (player && !paused) {
                    player.play?.();
                }
            } catch (e) {
                console.warn("FocusEffect play failed:", e);
            }

            return () => {
                try {
                    player?.pause?.();
                } catch (e) {
                    console.warn("FocusEffect pause failed:", e);
                }
            };
        }, [paused])
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            try {
                player?.pause?.();
            } catch (e) {
                console.warn("Unmount pause failed:", e);
            }
        };
    }, []);
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback>
                <View style={styles.container}>
                    <VideoView
                        nativeControls={false}
                        player={player}
                        style={styles.video}
                        contentFit="contain"
                        allowsFullscreen
                        allowsPictureInPicture={false}
                    />
                </View>
            </TouchableWithoutFeedback>

            {/* Mute Button */}
            <TouchableOpacity
                style={styles.muteButton}
                onPress={() => setMuted((m) => !m)}
            >
                <Icon
                    onPress={() => setMuted((m) => !m)}
                    iconName={muted ? "VolumeOff" : "Volume2"}
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
                    iconName={paused ? "Play" : "Pause"}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            <ActionButtonShort item={data} navigateToProfile={() => { }} />
        </View>
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