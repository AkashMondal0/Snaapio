import React, { useCallback, useRef, useState } from 'react';
import { View, FlatList, Dimensions, TouchableOpacity, Text, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Video, ResizeMode } from "expo-av";
import { useTheme } from 'hyper-native-ui';

const { height, width } = Dimensions.get('window');

const videos = [
  { id: '1', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '2', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
  { id: '3', uri: 'https://srcsaekkccuublpzpsnb.supabase.co/storage/v1/object/public/videos/dua/360p/index.m3u8' },
];

const ReelsPage = () => {
  const { currentTheme, themeScheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const videoRefs = useRef<any>([]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor("transparent");
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle("light-content");
      // Play the currently visible video when entering the page
      if (videoRefs.current) {
        videoRefs.current?.forEach((video: any) => {
          if (video) {
            video?.playAsync();
          }
        });
      }
      return () => {
        StatusBar.setBackgroundColor(currentTheme.background);
        StatusBar.setTranslucent(false);
        StatusBar.setBarStyle(themeScheme === "dark" ? "light-content" : "dark-content");
        // Stop all videos when exiting the screen
        videoRefs.current?.forEach((video: any) => {
          if (video) {
            video?.pauseAsync(); // Ensure all videos are paused
          }
        });
      };
    }, [])
  );


  return (
    <>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              source={{ uri: item.uri }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              shouldPlay={index === currentIndex}
              isMuted={muted || index !== currentIndex} // Mute all videos except the visible one
              useNativeControls={false}
            />
            {index === currentIndex ? (
              <TouchableOpacity style={styles.muteButton} onPress={() => setMuted(!muted)}>
                <Text style={styles.muteText}>{muted ? '🔇' : '🔊'}</Text>
              </TouchableOpacity>
            ) : <></>}
          </View>
        )}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height, // Adjusting height for better optimization
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