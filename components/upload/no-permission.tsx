import { setAppPermissionDialog } from '@/redux-stores/slice/dialog';
import * as MediaLibrary from 'expo-media-library';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Linking, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button, Text } from 'hyper-native-ui';
import { configs } from '@/configs';
import React from 'react';

function PhotosPermissionRequester({ permission }: {
    permission: MediaLibrary.PermissionResponse
}) {
    const dispatch = useDispatch();
    const animation = useRef<LottieView>(null);
    useEffect(() => {
        animation.current?.play();
    }, []);

    if (permission.granted) return <View />;

    return (
        <View
            style={{
                flex: 1,
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 200,
                    height: 200,
                    alignContent: "center",
                }}
                source={require('../../assets/lottie/Animation - Camera.json')}
            />
            {permission.canAskAgain ?
                <>
                    <Text
                        variantColor="secondary"
                        style={{
                            textAlign: "center",
                            marginBottom: 20,
                            width: "60%",
                        }}>
                        {configs.AppDetails.name} needs access to your photos to upload images.
                    </Text>
                    <Button
                        variant="outline"
                        onPress={() => {
                            dispatch(setAppPermissionDialog({ visible: true, data: null }))
                        }}>
                        Access Photos
                    </Button>
                </> :
                <>
                    <Text
                        variantColor="secondary"
                        style={{
                            textAlign: "center",
                            marginBottom: 20,
                            width: "60%",
                            fontSize: 16,
                        }}>
                        If you have denied the permission, you can change it in the settings.
                    </Text>
                    <Button
                        variant="outline"
                        onPress={() => {
                            Linking.openSettings();
                        }}>
                        Open Settings
                    </Button>
                </>}
        </View>
    );
}

export default PhotosPermissionRequester;