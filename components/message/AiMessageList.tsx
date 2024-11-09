import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Message, NavigationProps, disPatchResponse } from '@/types';
import { FlatList, View,Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { Loader } from '@/components/skysolo-ui';
import debounce from "@/lib/debouncing";
import { ToastAndroid } from "react-native";
import { timeFormat } from '@/lib/timeFormat';
import { AiMessage, loadMyPrompt } from '@/redux-stores/slice/conversation';
import { localStorage } from '@/lib/LocalStorage';

const AiMessageList = memo(function AiMessageList({
    navigation
}: {
    navigation: NavigationProps
}) {
    const stopFetch = useRef(false)
    const dispatch = useDispatch()
    const totalFetchedItemCount = useRef<number>(0)

    const messages = useSelector((Root: RootState) => Root.ConversationState?.ai_messages)
    const messagesLoading = useSelector((Root: RootState) => Root.ConversationState?.ai_messageLoading)

    const loadMoreMessages = useCallback(async () => {
        if (totalFetchedItemCount.current === -1 || stopFetch.current) return
        const fetchList = await localStorage("get", "myPrompt")
        dispatch(loadMyPrompt(JSON.parse(fetchList as string)))
    }, [])

    // const fetchMore = debounce(() => loadMoreMessages(), 1000)

    useEffect(() => {
        loadMoreMessages()
    }, [])

    const navigateToImagePreview = useCallback((data: Message) => {
        navigation.navigate('message/assets/preview', { data })
    }, [])

    return (
        <FlatList
            inverted
            removeClippedSubviews={true}
            windowSize={16}
            // onEndReached={fetchMore}
            data={messages}
            bounces={false}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <MessageItem
                navigateToImagePreview={navigateToImagePreview}
                data={item}
                myself={!item.isAi}
                key={item.id} />}
            ListFooterComponent={<View style={{ width: "100%", height: 50 }}>
                {messagesLoading ? <Loader size={36} /> : <></>}
            </View>}
        />)
}, () => true)

export default AiMessageList

const MessageItem = memo(function Item({
    data, myself,
    navigateToImagePreview
}: {
    data: AiMessage, myself: boolean,
    navigateToImagePreview: (data: Message) => void
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const color = myself ? currentTheme?.primary_foreground : currentTheme?.foreground
    const bg = myself ? currentTheme?.primary : currentTheme?.muted

    const TimeFooter = () => {
        return (<View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
        }}>
            <Text
                style={{
                    color: color,
                    fontSize: 14,
                    lineHeight: 24,
                    fontWeight: '400',
                }}>
                {timeFormat(data?.createdAt as string)}
            </Text>
        </View>)
    }

    // text message
    return <View style={{
        flexDirection: 'row',
        justifyContent: myself ? 'flex-end' : 'flex-start',
        padding: 6,
    }}>
        <View style={{
            backgroundColor: bg,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 16,
            width: 'auto',
            maxWidth: '96%',
        }}>
            <Text
                style={{
                    color: color,
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: '400',
                }}>
                {data?.content}
            </Text>
            <TimeFooter />
        </View>
    </View>
}, (prev, next) => true)