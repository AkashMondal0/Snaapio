import { useState, useEffect } from 'react';
import { Button, Image, StyleSheet, View, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
    const [image, setImage] = useState(null);
    const [savedUri, setSavedUri] = useState(null); // To store the saved image URI

    useEffect(() => {
        // Request media library and file system permissions
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

    // Function to pick an image from the gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);  // Set the selected image URI
        }
    };

    // Function to compress and save the image
    const compressAndSaveImage = async () => {
        if (!image) return;

        // Compress the image
        const manipResult = await manipulateAsync(
            image,
            [],
            {
                compress: 0.4, // Compress to 50% of the original size
                format: SaveFormat.JPEG, // Save as JPEG
                base64: true,  // Make sure to request base64 encoding
            }
        );

        // Save the compressed image to the file system
        try {
            // Generate a new file URI in the app's document directory
            const fileUri = FileSystem.documentDirectory + 'compressed_image.jpg';

            // Write the image to the file system (base64 must not be null now)
            await FileSystem.writeAsStringAsync(fileUri, manipResult.base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Save to media library (for Android/iOS gallery)
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync('Compressed Images', asset, false);

            setSavedUri(fileUri);
            alert('Image saved at: ' + fileUri);
        } catch (error) {
            console.error('Error saving the file:', error);
            alert('Error saving the image.');
        }
    };

    // Function to render the image
    const _renderImage = () => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Button title="Pick an image from gallery" onPress={pickImage} />
            {image && _renderImage()}
            {image && <Button title="Compress and Save Image" onPress={compressAndSaveImage} />}
            {savedUri && (
                <View>
                    <Text>Compressed image saved at:</Text>
                    <Text>{savedUri}</Text>
                </View>
            )}
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
