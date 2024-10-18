import React, { memo, useCallback, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import * as MediaLibrary from 'expo-media-library';
import {
    Button,
    Icon,
    Text,
    Separator,
    TouchableOpacity as SU_TouchableOpacity,
    Input
} from '@/components/skysolo-ui';
import AppHeader from '@/components/AppHeader';
import { PageProps } from '@/types';
import { Plus } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { uploadFilesApi } from '@/redux-stores/slice/account/api.service';
import { AddImage, PreviewImage } from '@/components/upload/preview-image';

const PostReviewScreen = memo(function PostReviewScreen({
    navigation,
    route
}: PageProps<MediaLibrary.Asset[]>) {
    const [assets, setAssets] = useState(route?.params?.assets ? [...route.params?.assets] : [])
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const dispatch = useDispatch()

    const handleDelete = useCallback((id: string) => {
        setAssets((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const handledShare = useCallback(async () => {
        if (assets.length === 0) return
        if (!session) return ToastAndroid.show("Please login", ToastAndroid.SHORT)
        // hit api and loading all global uploading state
        // and reset all states
        setAssets([])
        navigation?.navigate("Root", { screen: "home" })
        setTimeout(() => {
            dispatch(uploadFilesApi({
                files: assets,
                caption: "caption 1",
                location: "kol-sky-007",
                tags: [],
                authorId: session?.id
            }) as any)
        }, 1000);
    }, [assets, session?.id])

    return (
        <>
            <AppHeader title="New Post" navigation={navigation} titleCenter />
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
                    // secondaryColor
                    placeholder='Write a caption...' />
                <Separator value={0.6} style={{ marginVertical: 2 }} />
                {/* description and details */}
                <InfoComponent />
            </ScrollView>
            <View style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Separator value={0.6} />
                <Button style={{ width: "95%", margin: 10 }} onPress={handledShare}>
                    Share
                </Button>
            </View>
        </>
    );
}, () => true);

export default PostReviewScreen;

const InfoComponent = memo(function InfoComponent() {
    const list = [
        { key: "Location", value: "Add Location", iconName: "MapPin" },
        { key: "Tags", value: "Tags people", iconName: "User" },
        { key: "Music", value: "Add Music", iconName: "Music" },
    ]
    return (<>
        <View style={{
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 10,
        }}>
            {list.map((item, i) => (
                <SU_TouchableOpacity
                    onPress={() => {
                        ToastAndroid.show(`coming soon`, ToastAndroid.SHORT)
                    }}
                    activeOpacity={0.8}
                    delayPressIn={0}
                    key={i}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        borderRadius: 10,
                        height: 50,
                        marginVertical: 2,
                        paddingHorizontal: 4,
                    }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <Icon iconName={item.iconName as any} size={24} />
                        <Text style={{ fontSize: 16 }}>{item.value}</Text>
                    </View>
                    <Icon iconName="ChevronRight" size={24} />
                </SU_TouchableOpacity>
            ))}
        </View>
    </>)
})