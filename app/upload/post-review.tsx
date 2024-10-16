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

const PostReviewScreen = memo(function PostReviewScreen({
    navigation,
    route
}: PageProps<MediaLibrary.Asset[]>) {
    const [assets, setAssets] = useState([...route.params?.assets] ?? [])
    const dispatch = useDispatch()
    const session = useSelector((state: RootState) => state.AuthState.session.user)

    const handleDelete = useCallback((id: string) => {
        setAssets((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const handledShare = useCallback(async () => {
        if (assets.length === 0) return
        if (!session) return ToastAndroid.show("Please login", ToastAndroid.SHORT)
        // hit api and loading all global uploading state
        // and reset all states
        setAssets([])
        navigation.navigate("Root", { screen: "home" })
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
                            <ImagePreview
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


const ImagePreview = memo(function ImagePreview({
    asset,
    handleDelete,
}: {
    asset: MediaLibrary.Asset,
    handleDelete: (i: string) => void
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return (<TouchableOpacity
        activeOpacity={0.8}
        style={{
            elevation: 0.5,
            width: 290,
            flex: 1,
            borderRadius: 16,
            aspectRatio: 4 / 5,
            marginHorizontal: 10,
        }}>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { handleDelete(asset.id) }}
            style={{
                position: "absolute",
                zIndex: 1,
                alignItems: "flex-end",
                width: "100%",
            }}>
            <View style={{
                backgroundColor: currentTheme?.muted,
                borderRadius: 100,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                margin: 6,
                elevation: 5,
            }}>
                <Icon
                    iconName="Trash2"
                    color={currentTheme?.foreground} size={20}
                    onPress={() => { handleDelete(asset.id) }} />
            </View>
        </TouchableOpacity>
        <Image
            source={{ uri: asset.uri }}
            style={{
                width: "auto",
                flex: 1,
                borderRadius: 16,
                aspectRatio: 4 / 5,
                resizeMode: "cover",
                // resizeMode: "contain",
                // aspectRatio: 9 / 16, // story
                // aspectRatio: 16 / 9,  // landscape
                // aspectRatio: 1 / 1, // square
            }} />
    </TouchableOpacity>)
}, (prev, next) => prev.asset.id === next.asset.id);

const AddImage = memo(function AddImage({
    onPress
}: {
    onPress: () => void
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return (<>
        <TouchableOpacity
            activeOpacity={0.8}
            style={{
                width: 288,
                borderRadius: 16,
                aspectRatio: 4 / 5,
                backgroundColor: currentTheme?.muted,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: currentTheme?.border,
                elevation: 0.5,
                marginHorizontal: 10
            }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 60,
                    borderColor: currentTheme?.border,
                    borderWidth: 2,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Plus color={currentTheme?.muted_foreground} size={70} strokeWidth={0.8} />
            </TouchableOpacity>
        </TouchableOpacity>
    </>)
}, () => true);

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