import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FlatList, ToastAndroid, View, ActivityIndicator } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Icon } from "@/components/skysolo-ui";
import AppHeader from "@/components/AppHeader";
import AppPermissionDialog from "@/components/dialogs/app-permission";
import PhotosPermissionRequester from "@/components/upload/no-permission";
import ImageItem from "@/components/upload/image";
import throttle from "@/lib/throttling";
import { PageProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { setDeviceAssets } from "@/redux-stores/slice/account";
import ActionNextButton from "../ActionNextButton";

type Props = PageProps<any> & {
  assetsLimit?: number;
  mediaType?: MediaLibrary.MediaTypeValue[]; // e.g. ['photo']
  showHeader?: boolean;
  nextAction: (selectedAssets: MediaLibrary.Asset[]) => void;
};

const SelectAssets = memo(function SelectAssets({
  nextAction,
  assetsLimit = 5,
  mediaType = ["photo"],
  showHeader = true,
}: Props) {
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const media = useSelector(
    (state: RootState) => state.AccountState.deviceAssets
  );
  const dispatch = useDispatch();

  // selection tracking
  const selectedAssetsRef = useRef<MediaLibrary.Asset[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  // pagination + loading
  const loadedOnceRef = useRef(false);
  const cursorRef = useRef<string | null>(null);
  const hasNextRef = useRef(true);
  const [loadingPage, setLoadingPage] = useState(false);

  const alertMessage = useCallback(
    throttle(() => {
      ToastAndroid.show(
        `You can select up to ${assetsLimit} images`,
        ToastAndroid.LONG
      );
    }, 5000),
    [assetsLimit]
  );

  // ---- Permissions
  const getMediaPermission = useCallback(async () => {
    const res = await requestPermission();
    return res;
  }, [requestPermission]);

  useEffect(() => {
    // Auto-prompt once if we can
    if (!permission) return;
    if (!permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // ---- Fetch page
  const fetchMediaPage = useCallback(
    async (reset = false) => {
      if (loadingPage) return;
      if (!hasNextRef.current && !reset) return;

      try {
        setLoadingPage(true);

        const { assets, endCursor, hasNextPage } =
          await MediaLibrary.getAssetsAsync({
            mediaType,
            first: 40,
            sortBy: [MediaLibrary.SortBy.creationTime],
            after: reset ? undefined : cursorRef.current ?? undefined,
          });

        cursorRef.current = endCursor ?? null;
        hasNextRef.current = !!hasNextPage;

        if (reset) {
          // ensure store contains only fresh page
          dispatch(setDeviceAssets(assets));
        } else {
          // append to existing
          dispatch(setDeviceAssets([...(media ?? []), ...assets]));
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to fetch assets:", e);
      } finally {
        setLoadingPage(false);
      }
    },
    [dispatch, media, mediaType, loadingPage]
  );

  // first load once granted
  useEffect(() => {
    if (permission?.granted && !loadedOnceRef.current) {
      loadedOnceRef.current = true;
      cursorRef.current = null;
      hasNextRef.current = true;
      fetchMediaPage(true);
    }
  }, [permission?.granted, fetchMediaPage]);

  // ---- Selection
  const onPressAssetHandle = useCallback(
    (asset: MediaLibrary.Asset) => {
      const idx = selectedAssetsRef.current.findIndex((a) => a.id === asset.id);
      if (idx === -1) {
        if (selectedAssetsRef.current.length >= assetsLimit) {
          alertMessage();
          return;
        }
        selectedAssetsRef.current.push(asset);
        setSelectedCount((prev) => prev + 1);
      } else {
        selectedAssetsRef.current.splice(idx, 1);
        setSelectedCount((prev) => Math.max(0, prev - 1));
      }
    },
    [assetsLimit, alertMessage]
  );

  // ---- Infinite scroll
  const onEndReached = useCallback(() => {
    if (!loadingPage && hasNextRef.current) {
      fetchMediaPage(false);
    }
  }, [fetchMediaPage, loadingPage]);

  // ---- Done / next
  const navigateToPostReview = useCallback(() => {
    const _selected = [...selectedAssetsRef.current];
    // reset selection
    selectedAssetsRef.current = [];
    setSelectedCount(0);
    nextAction(_selected);
  }, [nextAction]);

  // ---- Render UI
  if (!permission) {
    // Permission check pending
    return <View />;
  }

  if (!permission.granted) {
    return (
      <>
        <AppPermissionDialog confirm={getMediaPermission} />
        <PhotosPermissionRequester permission={permission} />
      </>
    );
  }

  return (
    <>
      {showHeader ? (
        <AppHeader
          titleCenter
          title={
            selectedCount > 0 ? `Selected ${selectedCount}` : "Select Items"
          }
          rightSideComponent={
            selectedCount > 0 ? (
              <Icon
                iconName="Check"
                isButton
                style={{ width: 36 }}
                onPress={navigateToPostReview}
                variant="primary"
              />
            ) : (
              <></>
            )
          }
        />
      ) : (
        <></>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          data={media}
          keyExtractor={(item: MediaLibrary.Asset) => item.id}
          numColumns={3}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={16}
          nestedScrollEnabled
          columnWrapperStyle={{ gap: 2, paddingVertical: 1 }}
          renderItem={({ item }) => (
            <ImageItem
              item={item}
              selectAssetIndex={selectedAssetsRef.current.findIndex(
                (a) => a.id === item.id
              )}
              onPressAssetHandle={onPressAssetHandle}
            />
          )}
          ListFooterComponent={
            loadingPage ? (
              <View
                style={{
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      </View>

      {selectedCount > 0 ? (
        <ActionNextButton onPress={navigateToPostReview} />
      ) : (
        <></>
      )}
    </>
  );
});

export default SelectAssets;
