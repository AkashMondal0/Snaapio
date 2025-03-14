import React, { memo, useCallback, useRef, useState } from 'react';
import { View, ScrollView, ToastAndroid } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Button, Separator, Input } from 'hyper-native-ui';
import AppHeader from '@/components/AppHeader';
import { disPatchResponse, PageProps, Story } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { AddImage, PreviewImage } from '@/components/upload/preview-image';
import { uploadHighlightApi } from '@/redux-stores/slice/account/api.service';
import { useNavigation } from '@react-navigation/native';

const HighlightUploadScreen = memo(function HighlightUploadScreen({
    route,
}: PageProps<{ stories: Story[] }>) {
    const [stories, setStories] = useState(route?.params?.stories ? [...route.params?.stories] : [])
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const [loading, setLoading] = useState(false)
    const inputRef = useRef("")
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const handleDelete = useCallback((id: string) => {
        setStories((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const handledShare = useCallback(async () => {
        try {
            if (stories.length === 0) return
            if (!session) return ToastAndroid.show("Please login", ToastAndroid.SHORT)
            setLoading(true)
            const res = await dispatch(uploadHighlightApi({
                stories: stories,
                content: inputRef.current,
                authorId: session?.id,
                status: "published",
                coverImageIndex: 0
            }) as any) as disPatchResponse<any>
            if (res.error) return ToastAndroid.show("Unknown error occur", ToastAndroid.SHORT)
            // setStories([])
            ToastAndroid.show("Highlight Created", ToastAndroid.SHORT)
            if (navigation?.canGoBack()) {
                navigation?.goBack()
            }
        } finally {
            setLoading(false)
        }
    }, [session?.id, stories.length])

    return (
        <>
            <AppHeader title="New Highlight" titleCenter />
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
                        data={stories}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <PreviewImage
                                isServerImage={true}
                                assetUrl={item.fileUrl ? item.fileUrl[0].original_sm : null}
                                id={item.id}
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
                <View style={{
                    width: "95%",
                    marginHorizontal: "2.5%",
                    marginVertical: 10,
                }}>
                    <Input
                        disabled={loading}
                        onChangeText={(text) => inputRef.current = text}
                        placeholder='Highlight Name' />
                </View>
                <Separator value={0.6} style={{ marginVertical: 2 }} />
                {/* description and details */}
                {/* <InfoComponent /> */}
            </ScrollView>
            <View style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Separator value={0.6} />
                <Button
                    loading={loading}
                    disabled={loading}
                    style={{ width: "95%", margin: 10 }}
                    onPress={handledShare}>
                    Share
                </Button>
            </View>
        </>
    );
}, () => true);

export default HighlightUploadScreen;