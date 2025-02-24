import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Conversation, Message } from '@/types';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import debounce from "@/lib/debouncing";
import MessageItem from './messageItem';
import { Loader } from 'hyper-native-ui';
import { useNavigation } from '@react-navigation/native';
import { useGQArray } from '@/lib/useGraphqlQuery';
import ErrorScreen from '../error/page';
import ListEmpty from '../ListEmpty';
import { CQ } from '@/redux-stores/slice/conversation/conversation.queries';
import { conversationSeenAllMessage } from "@/redux-stores/slice/conversation/api.service";

const MessageList = memo(function MessageList({
    conversation,
}: {
    conversation: Conversation,
}) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const session = useSelector((Root: RootState) => Root.AuthState.session.user);
    const cMembers = useMemo(() => conversation.members?.map((m) => m).length, [conversation.members]);
    const { data, error, loadMoreData, loading } = useGQArray<Message>({
        query: CQ.findAllMessages,
        order: "reverse",
        variables: {
            limit: 16,
            id: conversation.id
        },
    });

    const seenAllMessage = useCallback(debounce(() => {
        if (!conversation?.id || !session?.id) return;
        dispatch(conversationSeenAllMessage({
            conversationId: conversation.id,
            authorId: session?.id,
            members: conversation.members?.filter((member) => member !== session?.id),
        }) as any);
    }, 1000), [session, conversation]);


    const navigateToImagePreview = useCallback((data: Message) => {
        navigation.navigate("MessageImagePreview" as any, { data })
    }, [])

    return (
        <FlatList
            inverted
            data={data}
            windowSize={16}
            bounces={false}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            onEndReachedThreshold={0.5}
            refreshing={false}
            onEndReached={loadMoreData}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <MessageItem
                navigateToImagePreview={navigateToImagePreview}
                data={item} seenMessage={cMembers === item.seenBy?.length}
                key={item.id} myself={session?.id === item.authorId} />}
            ListEmptyComponent={() => {
                if (error && loading === "normal") {
                    return <ErrorScreen message={error} />;
                }
                if (data.length <= 0 && loading === "normal") {
                    return <ListEmpty text="No Message" />;
                }
                return <View />
            }}
            ListFooterComponent={() => {
                if (loading !== "normal") {
                    return <Loader size={50} />
                }
                return <View />;
            }}
        />)
}, (prev, next) => prev.conversation.id === next.conversation.id)

export default MessageList;
