// import React, { memo, useCallback, useMemo } from 'react';
// import { Conversation, Message } from '@/types';
// import { FlatList } from 'react-native';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux-stores/store';
// import MessageItem from './messageItem';
// import { useNavigation } from '@react-navigation/native';

// const MessageList =({
//     conversation,
//     messages,
//     loadMoreData
// }: {
//     conversation: Conversation,
//     messages: Message[]
//     loadMoreData: VoidFunction
// }) => {
   

//     return (
//         <FlatList
//             inverted
//             data={messages}
//             windowSize={16}
//             bounces={false}
//             scrollEventThrottle={16}
//             removeClippedSubviews={true}
//             onEndReachedThreshold={0.5}
//             refreshing={false}
//             keyExtractor={(item) => item.id}
//             showsVerticalScrollIndicator={false}
//             onEndReached={loadMoreData}
//             renderItem={({ item }) => <MessageItem
//                 navigateToImagePreview={navigateToImagePreview}
//                 data={item} seenMessage={cMembers === item.seenBy?.length}
//                 key={item.id} myself={session?.id === item.authorId} />}
//         // ListEmptyComponent={() => {
//         //     if (error && loading === "normal") {
//         //         return <ErrorScreen message={error} />;
//         //     }
//         //     if (data.length <= 0 && loading === "normal") {
//         //         return <ListEmpty text="No Message" />;
//         //     }
//         //     return <View />
//         // }}
//         // ListFooterComponent={() => {
//         //     if (loading !== "normal") {
//         //         return <Loader size={50} />
//         //     }
//         //     return <View />;
//         // }}
//         />)
// };

// export default MessageList;
