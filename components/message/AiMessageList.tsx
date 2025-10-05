import React, { memo, useCallback, useMemo } from "react";
import {
  FlatList,
  View,
  Clipboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import { RootState } from "@/redux-stores/store";
import { Icon } from "@/components/skysolo-ui";
import { useTheme, Text } from "hyper-native-ui";
import { timeFormat } from "@/lib/timeFormat";
import {
  AiMessage,
  completeAiMessageGenerate,
} from "@/redux-stores/slice/conversation";
import AITextLoader from "@/app/message/AITextLoader";
import ImageComponent from "@/components/skysolo-ui/Image";
import Markdown from "react-native-markdown-display";
import { configs } from "@/configs";

/**
 * ===============================
 * AiMessageList
 * ===============================
 */
const AiMessageList = memo(
  function AiMessageList() {
    const { messages, currentId } = useSelector(
      (state: RootState) => ({
        messages: state.ConversationState.ai_messages,
        currentId: state.ConversationState.ai_CurrentMessageId,
      }),
      shallowEqual
    );

    const renderItem = useCallback(
      ({ item }: { item: AiMessage }) => (
        <MessageItem
          data={item}
          myself={!item.isAi}
          currentTyping={item.id === currentId}
        />
      ),
      [currentId]
    );

    const keyExtractor = useCallback((item: AiMessage) => item.id, []);

    return (
      <FlatList
        inverted
        removeClippedSubviews
        windowSize={16}
        data={messages}
        bounces={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />
    );
  },
  () => true
);

export default AiMessageList;

/**
 * ===============================
 * MessageItem
 * ===============================
 */
type ItemProps = {
  data: AiMessage;
  myself: boolean;
  currentTyping: boolean;
};

const MessageItem = memo(
  function MessageItem({ data, myself, currentTyping }: ItemProps) {
    const { currentTheme } = useTheme();
    const dispatch = useDispatch();

    const color = myself
      ? currentTheme?.primary_foreground
      : currentTheme?.foreground;
    const bg = myself ? currentTheme?.primary : currentTheme?.muted;

    const containerAlignStyle = useMemo(
      () => ({ justifyContent: myself ? "flex-end" : "flex-start" }),
      [myself]
    );

    const bubbleStyle = useMemo(
      () => ({
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        maxWidth: "94%",
        backgroundColor: bg,
        elevation: 0.5,
      }),
      [bg]
    );

    const onCopy = useCallback(() => {
      if (Platform.OS === "android") {
        Clipboard.setString(
          configs.serverApi.supabaseStorageUrl +
            (data.data?.content ?? "Something went wrong")
        );
      }
    }, [data.data?.content]);

    const onDownloadImage = useCallback(async () => {
      try {
        const url =
          configs.serverApi.supabaseStorageUrl + data.data?.url ||
          configs.serverApi.supabaseStorageUrl + data.image;
        if (!url) return;

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          console.warn("MediaLibrary permission not granted");
          return;
        }

        const filename = url.split("/").pop() || `ai-image-${Date.now()}.jpg`;
        const dest = `${FileSystem.documentDirectory}${filename}`;

        const { uri } = await FileSystem.downloadAsync(url, dest);
        const asset = await MediaLibrary.createAssetAsync(uri);

        const albumName = "AI Images";
        const album = await MediaLibrary.getAlbumAsync(albumName);
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync(albumName, asset, false);
        }
      } catch (e) {
        console.warn("Failed to save image:", e);
      }
    }, [data.data?.url, data.image]);

    /**
     * CASE 1: AI typing TEXT (loader while empty)
     */
    if (data.isAi && currentTyping && data.data?.type !== "image") {
      if (!data.data?.content) {
        return (
          <View
            style={[
              { flexDirection: "row", padding: 6 },
              containerAlignStyle as any,
            ]}
          >
            <View style={bubbleStyle as any}>
              <AITextLoader
                onComplete={() => dispatch(completeAiMessageGenerate())}
                text="Generating response..."
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 6,
                }}
              >
                <Text
                  style={{ fontSize: 13 }}
                  variant="caption"
                  variantColor="secondary"
                >
                  {timeFormat(data.createdAt as string)}
                </Text>
              </View>
            </View>
          </View>
        );
      }
    }

    /**
     * CASE 2: AI generating IMAGE (loader while empty)
     */
    if (data.isAi && currentTyping && data.data?.type === "image") {
      if (!data.data?.url && !data.image) {
        return (
          <View
            style={[
              { flexDirection: "row", padding: 6 },
              containerAlignStyle as any,
            ]}
          >
            <View
              style={{
                width: 280,
                height: 280,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                backgroundColor: "#f0f0f0",
              }}
            >
              <ActivityIndicator size="large" color={currentTheme?.primary} />
              <Text variant="body2" style={{ marginTop: 8 }}>
                Generating image...
              </Text>
            </View>
          </View>
        );
      }
    }

    /**
     * CASE 3: Final IMAGE message
     */
    if (data.data?.type === "image" && (data.data.url || data.image)) {
      const imgUrl = data.data.url || data.image!;
      return (
        <View
          style={[
            { flexDirection: "row", padding: 6 },
            containerAlignStyle as any,
          ]}
        >
          <View
            style={{
              maxWidth: "94%",
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "white",
              elevation: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
            }}
          >
            <ImageComponent
              url={imgUrl}
              style={{
                width: 280,
                height: 280,
                borderRadius: 20,
              }}
              resizeMode="cover"
            />

            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                flexDirection: "row",
                gap: 8,
                backgroundColor: "rgba(0,0,0,0.35)",
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderRadius: 29,
              }}
            >
              <Icon
                iconName="Download"
                size={22}
                variant="secondary"
                isButton
                onPress={onDownloadImage}
              />
              <Icon
                iconName="Copy"
                size={22}
                variant="secondary"
                isButton
                onPress={() =>
                  Clipboard.setString(
                    configs.serverApi.supabaseStorageUrl + imgUrl
                  )
                }
              />
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: "rgba(255,255,255,0.95)",
              }}
            >
              <Text variant="caption" variantColor="secondary">
                {timeFormat(data.createdAt as string)}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    /**
     * CASE 4: Normal text
     */
    return (
      <View
        style={[{ flexDirection: "row", padding: 6 }, containerAlignStyle as any]}
      >
        <View style={bubbleStyle as any}>
          <Markdown
            style={{
              body: { color, fontSize: 16, lineHeight: 22 },
              paragraph: { color, fontSize: 16, lineHeight: 22 },
              heading1: { color, fontSize: 28, fontWeight: "700" },
              heading2: { color, fontSize: 24, fontWeight: "700" },
              heading3: { color, fontSize: 20, fontWeight: "700" },
              code_block: {
                borderRadius: 2,
                borderWidth: 1,
                borderColor: currentTheme?.border,
                padding: 10,
              },
              code_inline: {
                borderRadius: 2,
                borderWidth: 1,
                borderColor: currentTheme?.border,
                paddingHorizontal: 6,
                paddingVertical: 2,
              },
              link: { textDecorationLine: "underline" },
            }}
          >
            {data.data?.content ?? "Something went wrong"}
          </Markdown>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 6,
            }}
          >
            <Text
              style={{ fontSize: 13 }}
              variant="caption"
              variantColor="secondary"
            >
              {timeFormat(data.createdAt as string)}
            </Text>
          </View>
        </View>

        {!myself ? <Icon iconName="Copy" size={24} onPress={onCopy} /> : null}
      </View>
    );
  },
  (prev, next) =>
    prev.data.id === next.data.id &&
    prev.currentTyping === next.currentTyping &&
    prev.data.data?.content === next.data.data?.content &&
    prev.data.data?.url === next.data.data?.url
);
