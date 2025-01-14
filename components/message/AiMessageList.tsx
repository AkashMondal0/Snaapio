import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Message, NavigationProps } from '@/types';
import { FlatList, View, Text, StyleSheet, Clipboard, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { Icon, Loader } from '@/components/skysolo-ui';
import { useTheme } from 'hyper-native-ui';    
import { ToastAndroid } from "react-native";
import { timeFormat } from '@/lib/timeFormat';
import { AiMessage, loadMyPrompt } from '@/redux-stores/slice/conversation';
import { localStorage } from '@/lib/LocalStorage';

import Markdown, { MarkdownIt, stringToTokens, tokensToAST } from 'react-native-markdown-display';
let loaded = false
const AiMessageList = memo(function AiMessageList({
    navigation
}: {
    navigation: NavigationProps
}) {
    const stopFetch = useRef(false)
    const dispatch = useDispatch()
    const totalFetchedItemCount = useRef<number>(0)

    const messages = useSelector((Root: RootState) => Root.ConversationState?.ai_messages)
    const messagesLoading = useSelector((Root: RootState) => Root.ConversationState?.ai_messageCreateLoading)

    const loadMoreMessages = useCallback(async () => {
        if (loaded) return
        const fetchList = await localStorage("get", "myPrompt")
        dispatch(loadMyPrompt(JSON.parse(fetchList as string)))
        loaded = true
    }, [])

    // const fetchMore = debounce(() => loadMoreMessages(), 1000)

    useEffect(() => {
        loadMoreMessages()
    }, [])

    const navigateToImagePreview = useCallback((data: Message) => {
        // navigation.navigate('message/assets/preview', { data })
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
            ListHeaderComponent={<View style={{ width: "100%", height: 50 }}>
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
    const { currentTheme } = useTheme();
    const color = myself ? currentTheme?.primary_foreground : currentTheme?.foreground
    const bg = myself ? currentTheme?.primary : currentTheme?.muted

    const markdownItInstance = MarkdownIt({ typographer: true });

    const ast = tokensToAST(stringToTokens(data.content, markdownItInstance))

    const styles = StyleSheet.create({
        heading1: {
            fontSize: 32,
            color: color,
        },
        heading2: {
            fontSize: 24,
            color: color,
        },
        heading3: {
            fontSize: 18,
            color: color,
        },
        heading4: {
            fontSize: 16,
            color: color,
        },
        heading5: {
            fontSize: 13,
            color: color,
        },
        heading6: {
            fontSize: 11,
            color: color,
        },
        body: {
            fontSize: 16,
            color: "black",
        },
        paragraph: {
            fontSize: 16,
            color: color,
        },
        link: {
            color: 'blue',
            fontSize: 16,
        },
        code_block: {
            color: currentTheme?.accent_foreground,
            borderRadius: 30,
            borderColor: currentTheme?.border,
            borderWidth: 1,
        },
        code_inline: {
            color: currentTheme?.foreground,
            borderRadius: 30,
            borderColor: currentTheme?.border,
            borderWidth: 1,
        }
    });


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
            maxWidth: '94%',
            elevation: 0.4
        }}>
            {data.image && !data.isAi ? <Image source={{ uri: data.image }} style={{
                height: 250,
                aspectRatio: 1,
                borderRadius: 20,
            }} /> : <></>}
            <Markdown style={styles}>
                {/* @ts-ignore */}
                {ast}
            </Markdown>

            {/* date and time */}
            <View style={{
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
            </View>
        </View>
        {myself ? <></> : <Icon iconName='Copy'
            size={24} onPress={() => {
                Clipboard.setString(data.content)
                ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT)
            }} />}
    </View>
}, (prev, next) => true)