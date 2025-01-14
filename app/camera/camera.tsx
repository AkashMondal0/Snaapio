import React, { memo, useCallback } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, FlatList, Text, TouchableOpacity, View, Image, StatusBar } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import debounce from '@/lib/debouncing';
import { Icon } from '@/components/skysolo-ui';
import { useTheme } from 'hyper-native-ui';

interface SendImagesScreenProps {
    navigation?: any
    route?: {
        params: {

        }
    }
}
const CameraScreen = ({ navigation, route }: SendImagesScreenProps) => {
    // const session = useSelector((state: RootState) => state.AuthState.session.user)
    const { currentTheme } = useTheme();
    const [facing, setFacing] = useState<"front" | "back">('back');
    const cameraRef = React.useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [media, setMedia] = useState<MediaLibrary.Asset[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [selectedAssets, setSelectedAssets] = useState<MediaLibrary.Asset[]>([]);
    const [disable, setDisable] = useState<boolean>(false);


    const toggleCameraType = useCallback(() => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }, [])

    const photoCapture = async () => {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync(options);
            if (photo?.uri) {
                // const data: Assets[] = [{
                //     _id: uid(),
                //     url: photo.uri,
                //     type: "image",
                //     caption: "",
                // }]
                // navigation.replace('Preview', {
                //     assets: data,
                //     user: profileState,
                //     type: route?.params.type,
                //     newChat: route?.params.newChat,
                //     forDirectMessage: route?.params.forDirectMessage,
                // })
            }
        }
    }

    const fetchMediaPagination = async () => {
        setDisable(true)
        // permission
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (!permission.granted) {
            return;
        }
        const {
            assets: mediaResult,
            endCursor,
            hasNextPage,
            totalCount: totalMediaCount,
        } = await MediaLibrary.getAssetsAsync({
            mediaType: ['photo'],
            first: 20,
            sortBy: MediaLibrary.SortBy.default,
            after: totalCount.toString(),
        });

        if (totalCount < totalMediaCount) {
            setMedia([...media, ...mediaResult]);
            setTotalCount(Number(endCursor))
        }
    }

    const throttledFunction = debounce(() => fetchMediaPagination(), 1000);

    const SelectAssets = async (assets: MediaLibrary.Asset) => {
        setSelectedAssets([...selectedAssets, assets])
    }

    const navigateToPreview = () => {
        // const data: Assets[] = selectedAssets.map((item) => {
        //     return {
        //         _id: item.id,
        //         url: item.uri,
        //         type: item.mediaType === "photo" ? "image" : "video",
        //         caption: ""
        //     }
        // })
        // navigation.push('Preview', {
        //     assets: data,
        //     user: profileState,
        //     type: route?.params.type,
        //     newChat: route?.params.newChat,
        //     forDirectMessage: route?.params.forDirectMessage,
        // })
    }


    const singleAssetSend = async (assets: MediaLibrary.Asset) => {
        // const data: Assets[] = [{
        //     _id: assets.id,
        //     url: assets.uri,
        //     type: assets.mediaType === "photo" ? "image" : "video",
        //     caption: ""
        // }]
        // navigation.replace('Preview', {
        //     assets: data,
        //     user: profileState,
        //     type: route?.params.type,
        //     newChat: route?.params.newChat,
        //     forDirectMessage: route?.params.forDirectMessage,
        // })
    }


    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={{
                flex: 1,
                backgroundColor: currentTheme?.background,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{
                    textAlign: 'center',
                    color: currentTheme?.foreground
                }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: currentTheme?.background,
        }}>
            <CameraView
                ref={cameraRef}
                style={{
                    aspectRatio: 9 / 16,
                }}
                facing={facing}
            >
                <View style={{ height: StatusBar.currentHeight }} />
                <Header />
                <View style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    flex: 1,
                    borderTopWidth: 0.1,
                }}>
                    <View style={{
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        paddingBottom: 10,
                    }}>
                        {selectedAssets.length > 0 ?
                            <Icon iconName='Check' size={40} onPress={navigateToPreview} isButton />
                            : <></>}
                    </View>
                    <View style={{
                        height: 80,
                    }}>
                        <FlatList
                            removeClippedSubviews={true}
                            initialNumToRender={10}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            updateCellsBatchingPeriod={100}
                            onEndReached={throttledFunction}
                            data={media}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => {
                                return <ImageItem
                                    item={item}
                                    index={index}
                                    SelectAssets={SelectAssets}
                                    singleAssetSend={singleAssetSend} />
                            }} />
                    </View>
                    <Footer
                        navigation={navigation}
                        disable={disable}
                        photoCapture={photoCapture}
                        imagePicker={fetchMediaPagination}
                        toggleCameraType={toggleCameraType} />
                    <View style={{ height: StatusBar.currentHeight }} />
                </View>
            </CameraView>
        </View>
    );
}

export default memo(CameraScreen)

const Header = ({
    navigation,
}: {
    navigation?: any,
}) => {
    return (
        <View style={{
            flex: 1,
        }}>
            <View style={{
                height: 60,
                justifyContent: "center",
                paddingHorizontal: 15,
                alignContent: "space-between",
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Icon iconName='X' size={40} isButton onPress={() => {
                        navigation.goBack()
                    }} />
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                    }}>
                        <Icon iconName='Zap' size={40} isButton />
                    </View>
                </View>
            </View>
        </View>
    )
}

const Footer = ({
    navigation,
    toggleCameraType,
    photoCapture,
    imagePicker,
    disable,
}: {
    navigation?: any,
    toggleCameraType?: () => void,
    photoCapture?: () => void,
    imagePicker?: () => void,
    disable?: boolean,
}) => {
    const { currentTheme } = useTheme();

    return (
        <>
            <View style={{
                height: 60,
                width: "100%",
                paddingTop: 20,
                justifyContent: "center",
                paddingHorizontal: 15,
                alignContent: "space-between",
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Icon iconName='ImageIcon' size={40} onPress={imagePicker} isButton />
                    <View style={{
                        width: 60,
                        height: 60,
                        backgroundColor: "transparent",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignContent: "center",
                        borderColor: "white",
                        borderWidth: 5,
                        padding: 30,
                    }}>
                        <TouchableOpacity
                            onPress={photoCapture}
                            activeOpacity={0.8}
                            style={{
                                width: 50,
                                height: 50,
                                backgroundColor: currentTheme?.background,
                                borderRadius: 30,
                                justifyContent: "center",
                                alignContent: "center",
                                alignSelf: "center",
                            }} />
                    </View>
                    <Icon iconName='SwitchCamera' isButton size={40} onPress={toggleCameraType!} />
                </View>
            </View>
        </>
    )
}


// const StatusHeader = ({
// }) => {

//     return (
//         <>
//             <View style={{
//                 height: 80,
//                 justifyContent: "center",
//                 paddingHorizontal: 15,
//                 alignContent: "space-between",
//                 paddingTop: StatusBar.currentHeight,
//             }}>
//                 {/* <Padding size={30} /> */}
//                 <View style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                 }}>
//                     <Text style={{
//                         fontSize: 25,
//                         fontWeight: 'bold',
//                         color: theme.primaryTextColor,
//                     }}>
//                         <Icon_Button
//                             theme={theme}
//                             onPress={() => {
//                                 navigation.goBack()
//                             }}
//                             size={40}
//                             icon={<X
//                                 size={30} color={theme.iconColor} />} />
//                     </Text>
//                     {/* <View style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         gap: 15,
//                     }}>
//                         <Icon_Button
//                             theme={theme}
//                             onPress={() => { }}
//                             size={40}
//                             icon={<ArrowLeft
//                                 size={30} color={theme.iconColor} />} />
//                         <TouchableOpacity
//                             onPress={() => {
//                                 AnimatedState.SearchList_on()
//                             }}>
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     navigation.navigate("Setting")
//                                 }}>
//                                 <Settings2 size={30} color={theme.iconColor} />
//                             </TouchableOpacity>
//                         </TouchableOpacity>
//                     </View> */}
//                 </View>
//             </View>
//         </>
//     );
// };


const ImageItem = memo(function ImageItem({
    item,
    index,
    SelectAssets,
    singleAssetSend,
}: {
    item: MediaLibrary.Asset,
    index: number,
    SelectAssets: (assets: MediaLibrary.Asset) => void,
    singleAssetSend: (assets: MediaLibrary.Asset) => void,
}) {
    return (
        <TouchableOpacity
            style={{
                justifyContent: "center",
                alignItems: "center",
                height: 75,
            }}
            activeOpacity={0.8}
        // onPress={() => {
        //     if (selectedAssets.length === 0) {
        //         singleAssetSend(item)
        //     } else {
        //         if (selectedAssets.includes(item)) {
        //             const index = selectedAssets.indexOf(item);
        //             if (index > -1) {
        //                 selectedAssets.splice(index, 1);
        //             }
        //             setSelectedAssets([...selectedAssets])
        //         } else {
        //             if (selectedAssets.length > 0) {
        //                 SelectAssets(item)
        //             }
        //         }
        //     }
        // }}
        // onLongPress={() => {
        //     if (selectedAssets.length >= 0) {
        //         SelectAssets(item)
        //         Vibration.vibrate(100)
        //     }
        // }}
        >
            {/* {selectedAssets.includes(item) ? <View style={{
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Icon iconName='X' size={30} color={"white"} />
            </View> : <></>} */}
            <Image source={{ uri: item.uri }}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 10,
                    marginHorizontal: 5,
                    resizeMode: "cover",
                    borderColor: "white",
                    borderWidth: 0.4,
                }} />
        </TouchableOpacity>
    )
})