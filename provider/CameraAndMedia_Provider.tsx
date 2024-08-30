import React, { FC, createContext } from 'react';
import { View, Text, Button } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Camera, CameraType, } from 'expo-camera';

interface CameraAndMediaContextType {
    saveImage?: (uri: string) => void;
    cameraPermission?: any;
    getCameraPermission?: () => void;
    mediaPermission?: any;
    getMediaPermission?: () => void;
}

const CameraAndMediaContext = createContext<CameraAndMediaContextType>({});
export { CameraAndMediaContext };

interface CameraAndMedia_ProviderProps {
    children?: React.ReactNode;
}
const CameraAndMedia_Provider: FC<CameraAndMedia_ProviderProps> = ({
    children,
}) => {
    const [cameraPermission] = Camera.useCameraPermissions();
    const [mediaPermission] = MediaLibrary.usePermissions();

    const getCameraPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        if (status === "granted") {
            console.log("Camera permission granted");
        } else {
            console.log("Camera permission denied");
        }
    }

    const getMediaPermission = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
            console.log("Media permission granted");
        } else {
            console.log("Media permission denied");
        }
    }

    const saveImage = async (uri: string) => {
        try {
            // Request device storage access permission
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === "granted") {
                // Save image to media library
                await MediaLibrary.saveToLibraryAsync(uri);
                console.log("Image successfully saved");
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <CameraAndMediaContext.Provider value={{
            saveImage,
            cameraPermission,
            getCameraPermission,
            mediaPermission,
            getMediaPermission,
        }}>
            {children}
        </CameraAndMediaContext.Provider>
    );
};

export default CameraAndMedia_Provider;