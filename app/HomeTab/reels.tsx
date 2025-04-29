import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Icon } from '@/components/skysolo-ui';

const { height, width } = Dimensions.get('window');

const videos = [
  { id: '1', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '2', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/480p/1745848477241/playlist.m3u8' },
  { id: '3', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/480p/pkzt1c7G66FG/playlist.m3u8' },
];

// ✅ Custom hook to safely create video players
function useVideoPlayers(videoList: { id: string; uri: string }[]) {
  const players = videoList.map((video) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useVideoPlayer(video.uri, (p) => {
      p.loop = true;
    })
  );

  return videoList.reduce((acc, video, i) => {
    acc[video.id] = players[i];
    return acc;
  }, {} as { [id: string]: ReturnType<typeof useVideoPlayer> });
}

const ReelItem = ({
  uri,
  player,
  isActive,
  muted,
}: {
  uri: string;
  player: ReturnType<typeof useVideoPlayer>;
  isActive: boolean;
  muted: boolean;
}) => {
  useEffect(() => {
    if (!player) return;
    player.muted = muted;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, muted]);

  return (
    <View style={styles.container}>
      <VideoView
        nativeControls={false}
        player={player}
        style={styles.video}
        contentFit="cover"
        allowsFullscreen
        allowsPictureInPicture={false}
      />
    </View>
  );
};

const ReelsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const players = useVideoPlayers(videos);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  useFocusEffect(
    useCallback(() => {
      // On screen focus: resume current video
      const currentVideo = videos[currentIndex];
      const currentPlayer = players[currentVideo.id];
      try {
        currentPlayer?.play();
      } catch (e) {
        console.warn('Failed to resume video on focus:', e);
      }
  
      return () => {
        // On screen unfocus: pause all
        Object.values(players).forEach((player) => {
          try {
            player.pause();
          } catch (e) {
            console.warn('Failed to pause player on unfocus:', e);
          }
        });
      };
    }, [currentIndex, players])
  );
  
  const renderItem = useCallback(
    ({ item, index }: any) => (
      <View style={styles.container}>
        <ReelItem
          uri={item.uri}
          player={players[item.id]}
          isActive={index === currentIndex}
          muted={muted}
        />

        {index === currentIndex && (
          <TouchableOpacity
            style={styles.muteButton}
            onPress={() => setMuted((m) => !m)}
          >
            <Icon
              iconName={muted ? 'VolumeOff' : 'Volume2'}
              size={24}
              color="white"
              onPress={() => setMuted((m) => !m)}
            />
          </TouchableOpacity>
        )}

        <View style={styles.overlay}>
          <View style={styles.textContent}>
            <Text style={styles.title}>This is a title</Text>
            <Text style={styles.description}>
              This is a description of the video.
            </Text>
          </View>

          <View style={styles.sideButtons}>
            <Icon iconName="Heart" size={32} color="white" />
            <Icon iconName="MessageCircle" size={32} color="white" />
            <Icon iconName="Send" size={32} color="white" />
            <Icon iconName="Bookmark" size={32} color="white" />
            <Icon iconName="MoreHorizontal" size={32} color="white" />
          </View>
        </View>
      </View>
    ),
    [muted, currentIndex, players]
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
      initialNumToRender={2}
      maxToRenderPerBatch={3}
      windowSize={4}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  muteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textContent: {
    padding: 10,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: 'white',
    fontSize: 16,
  },
  sideButtons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    gap: 26,
    padding: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
});

export default ReelsPage;