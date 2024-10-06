import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/configs/initSupabase';

export default function App() {
    const [imageUri, setImageUri] = useState<any>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            if (!result.assets[0]?.uri) return;
            setImageUri(result.assets[0].uri);
            uploadFileToSupabase(result?.assets[0]?.uri, result?.assets[0]?.type);
        }
    };

    const uploadFileToSupabase = async (uri: any, fileType: any) => {
        try {
            const fileContents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            const fileName = `${new Date().getTime()}.jpg`; // Change as needed
            const fileBuffer = decode(fileContents);

            const { data, error } = await supabase.storage
                .from('skylight')
                .upload(fileName, fileBuffer, {
                    contentType: fileType,
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            console.log('File uploaded successfully:', data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <View>
            <Button title="Pick an image" onPress={pickImage} />
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
        </View>
    );
}
