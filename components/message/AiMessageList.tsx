import React, { memo, useCallback } from 'react';
import { Message } from '@/types';
import { FlatList, View, Text, StyleSheet, Clipboard, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { Icon } from '@/components/skysolo-ui';
import { useTheme } from 'hyper-native-ui';
import { ToastAndroid } from "react-native";
import { timeFormat } from '@/lib/timeFormat';
import { AiMessage, completeAiMessageGenerate } from '@/redux-stores/slice/conversation';
import Markdown, { MarkdownIt, stringToTokens, tokensToAST } from 'react-native-markdown-display';
import AITextLoader from '@/app/message/AITextLoader';
import ImageComponent from '../skysolo-ui/Image';
const AiMessageList = memo(function AiMessageList() {

    const messages = useSelector((Root: RootState) => Root.ConversationState?.ai_messages)
    const currentGeneratingMessage = useSelector((Root: RootState) => Root.ConversationState?.ai_CurrentMessageId)

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
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index: i }) => {
                if (!item.data) {
                    return <></>
                }
                if (item.data?.type === "image" && item.data.url) {
                    return <View key={item.id} style={{
                        padding: 6,
                    }}>
                        <ImageComponent url={item.data.url}
                            style={{
                                width: 300,
                                height: 300,
                                aspectRatio: 1 / 1,
                                borderRadius: 20,
                            }} />
                    </View>
                }
                return <MessageItem
                    navigateToImagePreview={navigateToImagePreview}
                    data={item}
                    currentTyping={item.id === currentGeneratingMessage}
                    myself={!item.isAi}
                    key={item.id} />
            }}
            ListHeaderComponent={<View style={{ width: "100%", height: 50 }}>
                {/* {messagesLoading ? <Loader size={36} /> : <></>} */}
            </View>}
        />)
}, () => true)

export default AiMessageList

const MessageItem = memo(function Item({
    data, myself,
    currentTyping,
    navigateToImagePreview
}: {
    data: AiMessage, myself: boolean,
    currentTyping: boolean
    navigateToImagePreview: (data: Message) => void
}) {
    const { currentTheme } = useTheme();
    const color = myself ? currentTheme?.primary_foreground : currentTheme?.foreground;
    const bg = myself ? currentTheme?.primary : currentTheme?.muted;
    const dispatch = useDispatch();

    const markdownItInstance = MarkdownIt({ typographer: true });

    const ast = tokensToAST(stringToTokens(data.data.content ?? "Something went wrong", markdownItInstance))

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

    if (data.isAi && currentTyping) {
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
                <AITextLoader
                    onComplete={() => {
                        dispatch(completeAiMessageGenerate())
                    }}
                    text={data.data.content ?? "Something went wrong"}
                />

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
                    Clipboard.setString(data.data.content ?? "Something went wrong")
                    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT)
                }} />}
        </View>
    }


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
                Clipboard.setString(data.data.content ?? "Something went wrong")
                ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT)
            }} />}
    </View>
}, (prev, next) => true)