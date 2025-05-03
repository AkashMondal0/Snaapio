import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Avatar, Icon } from '@/components/skysolo-ui';
import { useGQArray, useGQMutation } from '@/lib/useGraphqlQuery';
import { Post } from '@/types';
import { AQ } from '@/redux-stores/slice/account/account.queries';
import { Loader, Text } from 'hyper-native-ui';
import { TouchableWithoutFeedback } from 'react-native';
import { configs } from '@/configs';
import useDebounce from '@/lib/debouncing';
import { QPost } from '@/redux-stores/slice/post/post.queries';
import { Heart } from 'lucide-react-native';

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
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = muted; // Set initial mute state
  });

  const [paused, setPaused] = useState(false);

  // Apply mute when it changes
  useEffect(() => {
    if (player) {
      player.muted = muted;
    }
  }, [player, muted]);

  // Control playback based on isActive + paused state
  useEffect(() => {
    if (!player) return;

    if (isActive && !paused) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isActive, paused]);

  // Pause video when navigating away from screen
  useFocusEffect(
    useCallback(() => {
      // Resume if active
      if (player && isActive && !paused) {
        player.play();
      }

      // Cleanup: pause on blur
      return () => {
        try {
          player?.pause();
        } catch (e) {
          console.warn('Failed to pause player on unfocus:', e);
        }
      };
    }, [player, isActive, paused])
  );

  const togglePlayback = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={togglePlayback}>
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const navigateToProfile = useCallback(() => { }, [])

  useFocusEffect(
    useCallback(() => {
      // Nothing to do here anymore since each ReelItem handles its own play/pause
      return () => {
        // Cleanup if needed pause the video

      };
    }, [currentIndex])
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      const videoUrl = item?.fileUrl?.[0]?.shortVideoUrl;
      if (!videoUrl) return null;

      const fullUrl = `${configs.serverApi.supabaseStorageUrl}`.replace("/snaapio-production/", "/") + videoUrl;

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

          <ActionButtonShort
            item={item}
            navigateToProfile={navigateToProfile}
          />
        </View>
      );
    },
    [muted, currentIndex]
  );

  if (data.length <= 0 && loading === 'normal') {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>No videos yet</Text>
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
  textContent: {
    padding: 10,
    borderRadius: 10,
    width: '80%',
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

export function ActionButtonShort({
  item,
  navigateToProfile
}: { item: Post, navigateToProfile: () => void }) {
  const navigation = useNavigation();
  const [like, setLike] = useState({
    isLike: item.is_Liked,
    likeCount: item.likeCount
  })

  const { mutate } = useGQMutation<boolean>({
    mutation: QPost.createAndDestroyLike,
    onError: (err) => {
      setLike((pre) => ({
        isLike: !pre.isLike,
        likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
      }));
    }
  });

  const delayLike = useCallback((value: boolean) => {
    if (!item?.id) return;
    mutate({ input: { id: item?.id, like: value } })
  }, [item?.id])

  const debounceLike = useDebounce(delayLike, 500)

  const onLike = useCallback(() => {
    setLike((pre) => ({
      isLike: !pre.isLike,
      likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
    }))
    debounceLike(!like.isLike)
  }, [like.isLike, like.likeCount])

  return <View style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: "flex-end",
  }}>
    <View style={{
      marginHorizontal: "2%",
      // paddingVertical: 2,
      display: 'flex',
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    }}>
      <Avatar size={52} url={item.user?.profilePicture} onPress={navigateToProfile} />
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={navigateToProfile}>
          <Text style={{ fontWeight: "600" }}>
            {item?.user?.name}
          </Text>
        </TouchableOpacity>
        <Text
          style={{ fontWeight: "400" }}
          variantColor="secondary"
          variant="body2">
          {`india, kolkata`}
        </Text>
      </View>
    </View>
    <View style={styles.textContent}>
      {item.title ? <Text variant="body1">{item.title}</Text> : <></>}
      {item.content ? <Text variant="body2" variantColor="Grey">
        {item.content}
      </Text> : <></>}
    </View>

    {/* side button */}
    <View style={styles.sideButtons}>
      <View>
        {!like.isLike ? <Icon iconName={"Heart"} size={32} onPress={onLike} /> :
          <Heart size={32} fill={like.isLike ? "red" : ""} onPress={onLike} />}
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate("PostLike", { id: item.id })}>
          <Text style={{
            textAlign: "center", marginTop: 6, fontSize: 16,
            fontWeight: "600"
          }}>
            {like.likeCount}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity activeOpacity={1} onPress={() => {
        navigation.dispatch(StackActions.push("PostComment", { id: item.id }))
      }}>
        <Icon iconName="MessageCircle" size={32} onPress={() => {
          navigation.dispatch(StackActions.push("PostComment", { id: item.id }))
        }} />
        <Text style={{
          textAlign: "center", marginTop: 6, fontSize: 16,
          fontWeight: "600"
        }}>
          {item.commentCount}
        </Text>
      </TouchableOpacity>
      <Icon iconName="Send" size={32} />
      <Icon iconName="Bookmark" size={32} />
      <Icon iconName="MoreHorizontal" size={32} />
    </View>
  </View>;
}
