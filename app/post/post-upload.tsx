import React, { memo, useCallback, useRef, useState } from 'react';
import { View, ToastAndroid } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import * as MediaLibrary from 'expo-media-library';
import {
    Icon
} from '@/components/skysolo-ui';
import {
    Button,
    Text,
    Separator,
    TouchableOpacity as SU_TouchableOpacity,
    Input,
} from 'hyper-native-ui';
import AppHeader from '@/components/AppHeader';
import { PageProps } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { AddImage, PreviewImage } from '@/components/upload/preview-image';
import { uploadFilesApi } from '@/redux-stores/slice/account/api.service';
import { StackActions, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ScrollView } from 'react-native-gesture-handler';

const PostUploadScreen = memo(function PostUploadScreen({
    route
}: PageProps<{
    assets: MediaLibrary.Asset[]
}>) {
    const [assets, setAssets] = useState(route?.params?.assets ? [...route.params?.assets] : [])
    const session = useSelector((state: RootState) => state.AuthState.session.user)
    const loading = useSelector((state: RootState) => state.AccountState.uploadFilesLoading, (prev, next) => prev === next)
    const inputRef = useRef("")
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const handleDelete = useCallback((id: string) => {
        setAssets((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const handledShare = useCallback(async () => {
        if (assets.length === 0) return
        if (!session) return ToastAndroid.show("Please login", ToastAndroid.SHORT)
        // hit api and loading all global uploading state
        // and reset all states
        await dispatch(uploadFilesApi({
            files: assets,
            caption: inputRef.current,
            location: "kol-sky-007",
            tags: [],
            authorId: session?.id
        }) as any)
        setAssets([])
        ToastAndroid.show("Post uploaded", ToastAndroid.SHORT)
        if (!navigation.canGoBack()) {
            navigation.dispatch(StackActions.replace("HomeTabs"));
            return;
        }
        navigation.goBack();
    }, [assets.length, session?.id]);

    const pickImage = async () => {
        if (!session || loading) return;
        navigation.navigate("PickupImages");
    };

    return (
        <>
            {/* <PageLoader loading={loading} text='Uploading' /> */}
            <AppHeader title="New Post" titleCenter />
            <KeyboardAwareScrollView ScrollViewComponent={ScrollView}
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
                                assetUrl={item.uri}
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
                    // ListFooterComponent={<AddImage onPress={pickImage} />}
                    />
                </View>
                <View style={{
                    width: "95%",
                    marginHorizontal: "2.5%",
                    marginVertical: 10,
                }}>
                    <Input
                        disabled={loading}
                        multiline
                        numberOfLines={10}
                        style={{
                            minHeight: 140,
                            textAlignVertical: 'top'
                        }}
                        onChangeText={(text) => inputRef.current = text}
                        placeholder='Write a caption...' />
                </View>
                <Separator value={0.6} style={{ marginVertical: 2 }} />
                {/* description and details */}
                <InfoComponent />
            </KeyboardAwareScrollView>
            <View style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Separator value={0.6} />
                <Button
                    loading={loading}
                    disabled={loading}
                    center
                    style={{ width: "95%", margin: 10 }}
                    onPress={handledShare}>
                    Share
                </Button>
            </View>
        </>
    );
}, () => true);

export default PostUploadScreen;

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