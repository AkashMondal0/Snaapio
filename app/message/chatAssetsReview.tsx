import React, { memo, useCallback, useContext, useState } from 'react';
import { View, ScrollView, ToastAndroid } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import * as MediaLibrary from 'expo-media-library';
import {
    Button,
    Separator,
    Input,
    PageLoader,
    ThemedView
} from '@/components/skysolo-ui';
import AppHeader from '@/components/AppHeader';
import { Conversation, disPatchResponse, Message, PageProps } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { AddImage, PreviewImage } from '@/components/upload/preview-image';
import { SocketContext } from '@/provider/SocketConnections';
import { configs } from '@/configs';
import { CreateMessageApi, fetchConversationsApi } from '@/redux-stores/slice/conversation/api.service';

const ChatAssetsReviewScreen = memo(function ChatAssetsReviewScreen({
    navigation,
    route,
}: PageProps<{
    conversation: Conversation
    assets: MediaLibrary.Asset[]
}>) {
    const [assets, setAssets] = useState(route?.params?.assets ? [...route.params.assets] : [])
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const conversation = route?.params?.conversation ?? null
    const socketState = useContext(SocketContext)
    const members = conversation?.members ?? []
    const ConversationList = useSelector((state: RootState) => state.ConversationState.conversationList, (prev, next) => prev.length === next.length)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleDelete = useCallback((id: string) => {
        setAssets((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const sendMessageHandle = useCallback(async () => {
        setLoading((pre) => !pre)
        try {
            if (!session?.id || !conversation?.id) return ToastAndroid.show("Something went wrong CI", ToastAndroid.SHORT)
            const newMessage = await dispatch(CreateMessageApi({
                conversationId: conversation?.id,
                authorId: session?.id,
                content: "text image",
                fileUrl: assets,
                members: members,
            }) as any) as disPatchResponse<Message>
            if (newMessage?.payload?.id) {
                socketState.socket?.emit(configs.eventNames.conversation.message, {
                    ...newMessage.payload,
                    members: members
                })
            }
            if (ConversationList.findIndex((i) => i.id === conversation?.id) === -1) {
                await dispatch(fetchConversationsApi({
                    limit: 12,
                    offset: 0,
                }) as any)
            }
            if (navigation?.canGoBack()) {
                navigation.goBack()
            }
        } catch (error: any) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
        } finally {
            setLoading((pre) => !pre)
        }
    }, [
        ConversationList.length,
        conversation?.id,
        members.length,
        session?.id,
        socketState.socket,
        assets.length,
    ])

    return (
        <ThemedView style={{
            flex: 1
        }}>
            <AppHeader
                title={conversation?.user?.username ?? "Chat"}
                navigation={navigation} titleCenter />
            <ScrollView
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                style={{ flex: 1, width: "100%" }}>
                {/* Review Photos */}
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 20,
                        height: 364
                    }}>
                    <Animated.FlatList
                        data={assets}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <PreviewImage
                                asset={item}
                                handleDelete={handleDelete} />)}
                        horizontal
                        snapToAlignment='center'
                        snapToInterval={300}
                        decelerationRate="normal"
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        bouncesZoom={false}
                        alwaysBounceHorizontal={false}
                        alwaysBounceVertical={false}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='handled'
                        itemLayoutAnimation={LinearTransition}
                        contentContainerStyle={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                        ListFooterComponent={<AddImage onPress={() => { }} />} />
                </View>
                <Input
                    multiline
                    numberOfLines={4}
                    style={{
                        borderWidth: 0,
                        width: "95%",
                        margin: "2.5%",
                    }}
                    placeholder='Write a caption...' />
                <Separator value={0.6} style={{ marginVertical: 2 }} />
            </ScrollView>
            <View style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Separator value={0.6} />
                <Button
                    disabled={loading}
                    loading={loading}
                    style={{ width: "95%", margin: 10 }}
                    onPress={sendMessageHandle}>
                    Send
                </Button>
            </View>
        </ThemedView>
    );
}, () => true);

export default ChatAssetsReviewScreen;