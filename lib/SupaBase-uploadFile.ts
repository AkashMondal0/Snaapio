import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/configs/initSupabase';
import { uuid } from './uuid';

const uploadFileToSupabase = async (uri: any, fileType: any, id: string = ""): Promise<string | null> => {
    try {
        const fileContents = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const fileName = uuid() + uri.split('/').pop();
        const fileBuffer = decode(fileContents);

        const { data, error } = await supabase.storage
            .from(`skylight/${id}`)
            .upload(fileName, fileBuffer, {
                contentType: fileType,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Error uploading file 1:', error);
            return null;
        }
        return data.fullPath;
    } catch (error) {
        console.error('Error uploading file 2:', error);
        return null;
    }
};

export {
    uploadFileToSupabase
}