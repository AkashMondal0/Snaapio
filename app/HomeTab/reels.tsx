import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
  Text as RNText
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { Icon } from '@/components/skysolo-ui';
import { useGQArray } from '@/lib/useGraphqlQuery';
import { Post } from '@/types';
import { AQ } from '@/redux-stores/slice/account/account.queries';
import { Loader, Text, useTheme } from 'hyper-native-ui';
import { configs } from '@/configs';
import { ShortVideoActionButton } from '@/components/short-video';

const { height, width } = Dimensions.get('window');

const ReelItem = ({
  uri,
  isActive,
  muted,
}: {
  uri: string;
  isActive: boolean;
  muted: boolean;
}) => {
  const videoRef = useRef<Video>(null);
  const [paused, setPaused] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && !paused) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [isActive, paused]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(muted);
    }
  }, [muted]);

  useFocusEffect(
    useCallback(() => {
      if (isActive && !paused && videoRef.current) {
        videoRef.current.playAsync();
      }

      return () => {
        videoRef.current?.pauseAsync();
      };
    }, [isActive, paused])
  );

  const togglePlayback = () => {
    setPaused((prev) => !prev);
    setTimeout(() => {
      setShowButtons((prev) => !prev);
    }, paused ? 2800 : 0);
  };

  return (
    <TouchableWithoutFeedback onPress={togglePlayback}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
            display: showButtons ? 'flex' : 'none',
          }}
          onPress={togglePlayback}
        >
          <Icon
            onPress={togglePlayback}
            iconName={paused ? 'Play' : 'Pause'}
            size={34}
            color="white"
          />
        </TouchableOpacity>
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={isActive && !paused}
          isLooping
          isMuted={muted}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const ReelsPage = () => {
  const {
    data,
    error,
    loadMoreData,
    loading,
    reload,
    requestCount,
  } = useGQArray<Post>({
    query: AQ.shortFeedTimelineConnection,
    initialFetch: true,
  });
  const navigation = useNavigation();
  const { themeScheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const navigateToBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, []);

  const navigateToProfile = useCallback(() => { }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      const videoUrl = item?.fileUrl?.[0]?.shortVideoUrl;
      if (!videoUrl) return null;

      const fullUrl = configs.serverApi.supabaseStorageUrl + videoUrl;
      return (
        <View style={styles.container}>
          <ReelItem
            uri={fullUrl}
            isActive={index === currentIndex}
            muted={muted}
          />

          {index === currentIndex && (
            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => setMuted(m => !m)}
            >
              <Icon
                onPress={() => setMuted(m => !m)}
                iconName={muted ? 'VolumeOff' : 'Volume2'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          )}
          <ShortVideoActionButton item={item} />
        </View>
      );
    },
    [muted, currentIndex]
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

  if (data.length <= 0 && loading === 'normal') {
    return (
      <View style={styles.container}>
        <RNText style={{ color: "white" }}>No videos yet</RNText>
      </View>
    );
  }

  if (error && loading === 'normal') {
    return (
      <View style={styles.container}>
        <Text variant="H6">{error}</Text>
      </View>
    );
  }

  if (loading === 'pending' && requestCount === 0) {
    return (
      <View style={styles.container}>
        <Loader size={50} />
      </View>
    );
  }

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
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        bounces={false}
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
        onEndReached={loadMoreData}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={4}
      />
    </>
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
});

export default ReelsPage;
