import React, { useCallback, ReactNode } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Comment, Post } from "@/types";
import { useTheme } from "hyper-native-ui";
import { StackActions, useNavigation } from "@react-navigation/native";
import { QPost } from "@/redux-stores/slice/post/post.queries";
import { useGQArray } from "@/lib/useGraphqlQuery";
import { LikeItem } from "@/app/post/like";

const LikesBottomSheet = ({
  sheetRef,
  children,
  snapPoints = ["50%", "90%"],
  postData
}: {
  sheetRef: React.RefObject<BottomSheet>;
  snapPoints?: (string | number)[];
  postData: Post | null;
  children?: ReactNode;
}) => {
  const { currentTheme } = useTheme();
  const navigation = useNavigation()
  const { data: Users, error, loadMoreData, loading, reload, requestCount } = useGQArray<Comment>({
    query: QPost.findAllComments,
    variables: {
      limit: 12,
      id: postData?.id
    },
  });

  const onPress = useCallback((username: string) => {
    navigation.dispatch(StackActions.replace("Profile", { id: username }))
  }, []);

  // render
  const renderItem = useCallback(
    ({ item }: any) => (
      <LikeItem
        data={item}
        onPress={onPress} />
    ),
    []
  );
  return (
    <GestureHandlerRootView style={{
      flex: 1,
    }}>
      {children}
      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        enableOverDrag={false}
        enableContentPanningGesture={true}
        handleIndicatorStyle={{ backgroundColor: currentTheme.primary }}
        handleStyle={{ backgroundColor: currentTheme.background }}
        backgroundStyle={{ backgroundColor: currentTheme.background }}
        keyboardBehavior="extend"
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}>
        <BottomSheetFlatList
          data={Users}
          nestedScrollEnabled={true}
          onEndReachedThreshold={0.5}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default LikesBottomSheet;