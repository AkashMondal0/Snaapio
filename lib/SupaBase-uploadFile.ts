import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/configs/initSupabase';

const uploadFileToSupabase = async (uri: any, fileType: any): Promise<string | null> => {
    try {
        const fileContents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const fileName = `${new Date().getTime()}.${fileType.split('/')[1]}`;
        const fileBuffer = decode(fileContents);

        const { data, error } = await supabase.storage
            .from('skylight')
            .upload(fileName, fileBuffer, {
                contentType: fileType,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Error uploading file:', error);
            return null;
        }

        return data.fullPath;
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
};

export {
    uploadFileToSupabase
}