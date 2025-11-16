import { useState, useCallback } from 'react';
import { Button, Image, StyleSheet, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
    const [image, setImage] = useState<any[]>([]);

    const getPermission = useCallback((async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }

            const fileStatus = await MediaLibrary.requestPermissionsAsync();
            if (fileStatus.status !== 'granted') {
                alert('Sorry, we need file system permissions to make this work!');
            }
        }
    }), []);

    // Function to pick an image from the gallery
    const pickImage = async () => {
        getPermission();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.2,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            base64: true,
        });

        if (!result.canceled) {
            const images = result.assets.map((image: any) => image.uri);
            setImage(images);
        }
    };
    
    // Function to compress the image
    const compressImage = async (image: string) => {
        const compressedImage = await ImageManipulator.manipulateAsync(
            image,
            [
            ],
            {
                compress: 0.08,
                format: SaveFormat.JPEG,
                base64: true,
            }
        );
        setImage([compressedImage.uri]);
        return compressedImage.uri;
    };

    const saveImage = async (image: any) => {
        if (!image) return;
        const fileName = image.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;
        try {
            await FileSystem.moveAsync({
                from: image,
                to: newPath,
            });
            const asset = await MediaLibrary.createAssetAsync(newPath);
            await MediaLibrary.createAlbumAsync('Download', asset, false);
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <View style={styles.container}>
            <Button title="Pick an image from gallery" onPress={pickImage} />
            <Button title="Compress Image" onPress={() => compressImage(image[0])} />
            <Button title="Save Image" onPress={() => saveImage(image[0])} />
            <View style={styles.imageContainer}>
                {image.map((image, index) => (
                    <Image key={index} source={{ uri: image }}
                        style={styles.image} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
});
