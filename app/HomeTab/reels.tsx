import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from 'hyper-native-ui';
import { Icon } from '@/components/skysolo-ui';

const { height, width } = Dimensions.get('window');

const videos = [
  { id: '1', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '2', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '3', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '4', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '5', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '6', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
];

const ReelsPage = () => {
  const { currentTheme, themeScheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const videoRefs = useRef<{ [key: number]: Video | null }>({});

  // Handle video play/pause based on visibility
  useEffect(() => {
    Object.keys(videoRefs.current).forEach((key) => {
      const index = Number(key);
      const video = videoRefs.current[index];

      if (video) {
        if (index === currentIndex) {
          video.playAsync();
        } else {
          video.pauseAsync();
        }
      }
    });
  }, [currentIndex]);

  // Handles viewable item change to update `currentIndex`
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Optimized `renderItem` using useCallback
  const renderItem = useCallback(
    ({ item, index }: { item: any, index: number }) => (
      <View style={styles.container}>

        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.uri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={index === currentIndex}
          isMuted={muted || index !== currentIndex} // Mute all except the visible one
          useNativeControls={false}
        />
        {/* volume button */}
        {index === currentIndex && (
          <TouchableOpacity style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: 1,
            width: 40,
            height: 40,
            position: 'absolute',
            top: 50,
            right: 20,
          }} onPress={() => setMuted(!muted)}>
            {muted ? <Icon iconName="VolumeOff"
              size={24}
              color="white"
              style={{ padding: 5 }}
              onPress={() => {
                setMuted(!muted);
              }} /> : <Icon iconName="Volume2"
                size={24}
                style={{ padding: 5 }}
                onPress={() => {
                  setMuted(!muted);
                }} />}
          </TouchableOpacity>
        )}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: 10,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: "flex-end"
        }}>
          <View style={{
            // backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
            width: '80%',
          }}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              This is a title
            </Text>
            <Text style={{ color: "white", fontSize: 16 }}>
              This is a description of the video. It can be a bit longer to provide more context about the content.
            </Text>
          </View>

          {/* left side buttons */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            gap: 26,
            padding: 16,
            paddingVertical: 40,
          }}>
            <Icon iconName="Heart"
              size={32}
              color="white"
              style={{ padding: 5 }}
              onPress={() => {
                setMuted(!muted);
              }} />
            <Icon iconName="MessageCircle"
              size={32}
              color="white"
              style={{ padding: 5 }}
              onPress={() => {
                setMuted(!muted);
              }} />
            <Icon iconName="Send"
              size={32}
              color="white"
              style={{ padding: 5 }}
              onPress={() => {
                setMuted(!muted);
              }} />
            <Icon iconName="Bookmark"
              size={32}
              color="white"
              style={{ padding: 5 }}
              onPress={() => {
                setMuted(!muted);
              }} />
            <Icon iconName="MoreHorizontal"
              size={32}
              color="white"
              style={{ padding: 5 }}
              onPress={() => {
                setMuted(!muted);
              }} />
          </View>
        </View>
      </View>
    ),
    [muted, currentIndex]
  );

  // Handle StatusBar updates and cleanup
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('light-content');

      return () => {
        StatusBar.setBackgroundColor(currentTheme.background);
        StatusBar.setTranslucent(false);
        StatusBar.setBarStyle(themeScheme === 'dark' ? 'light-content' : 'dark-content');

        // Stop all videos when exiting the screen
        Object.values(videoRefs.current).forEach((video) => {
          video?.pauseAsync();
        });
      };
    }, [currentTheme, themeScheme])
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      horizontal={false}
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
      initialNumToRender={2} // Load only 2 items initially
      maxToRenderPerBatch={3} // Render 3 items per batch
      windowSize={4} // Keep 4 items in memory
      removeClippedSubviews // Optimize performance by removing off-screen items
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height, // Adjusting height for better optimization
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
    aspectRatio: 16 / 9
  },
  muteButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  muteText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ReelsPage;
