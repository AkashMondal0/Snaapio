import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system'
import { Assets } from '@/types';
import { uploadFileToSupabase } from './SupaBase-uploadFile';
type QA = { value: number, name: "low" | "high" }[];
const qualityArray: QA = [
    { value: 0.05, name: "low" },
    // { value: 0.3, name: "medium" },
    { value: 0.5, name: "high" }
];
export const ImageCompressor = async ({
    image,
    quality = "medium"
}: {
    image: string,
    quality?: "low" | "medium" | "high" | "blur" | "thumbnail"
}) => {
    const QualityFu = (qualityType: string = "default") => {
        switch (qualityType) {
            case 'low':
                return 0.2;
            case 'medium':
                return 0.4;
            case 'high':
                return 0.8;
            case 'blur':
                return 0.08;
            case 'thumbnail':
                return 0.1;
            default:
                return 0.4;
        }
    }
    try {
        const compressedImage = await manipulateAsync(image, [], {
            compress: QualityFu(quality),
            format: SaveFormat.JPEG,
            base64: true,
        });
        return compressedImage.uri;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const saveImage = async (image: any) => {
    if (!image) return;
    const fileName = image.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;
    try {
        // save the compressed image file
        await FileSystem.writeAsStringAsync(newPath, image, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return newPath;
    } catch (error) {
        console.error('Error:', error);
    }
}

export const ImageCompressorAllQuality = async ({
    image,
}: {
    image: string,
}): Promise<Assets["urls"] | null> => {
    let assetUrls: Assets["urls"] = {
        low: null, // 0.05
        high: null // 0.5
    }
    await Promise.all(qualityArray.map(async (quality, i) => {
        const CompressedImage = await manipulateAsync(image, [], {
            compress: quality.value,
            format: SaveFormat.JPEG,
            base64: true,
        });
        // upload the compressed image to the server storage and get the url
        if (!CompressedImage?.uri) return;
        try {
            const fileUrl = await uploadFileToSupabase(CompressedImage.uri, "image/jpeg", quality.name);
            if (!fileUrl) return;
            assetUrls[quality.name] = fileUrl;
        } catch (error) {
            assetUrls[quality.name] = null;
            console.error('Error:', error);
        }
    }))
    return assetUrls;
};
