import { useState, useEffect } from 'react';
import { Button, Image, StyleSheet, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
    const [image, setImage] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
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
        })();
    }, []);

    // Function to compress the image
    const compressImage = async (image: string) => {
        const compressedImage = await manipulateAsync(
            image,
            [],
            {
                compress: 0.2,
                format: SaveFormat.JPEG,
                base64: false,
            }
        );
        return compressedImage.uri;
    };

    // Function to pick an image from the gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.3,
            allowsMultipleSelection: true,
            selectionLimit: 5,
        });

        if (!result.canceled) {
            const images = result.assets.map((image: any) => image.uri);
            setImage(images);
            // // Compress all the images

            // const compressedImages = await Promise.all(images.map(async (image: any) => {
            //     const compressedImage = await compressImage(image);
            //     return compressedImage;
            // }));

            // setImage(compressedImages);
        }
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
            // setSavedUri(newPath);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Button title="Pick an image from gallery" onPress={pickImage} />
            <View style={styles.imageContainer}>
                {image.map((image, index) => (
                    <Image key={index} source={{ uri: image }}
                        resizeMode="cover"
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
