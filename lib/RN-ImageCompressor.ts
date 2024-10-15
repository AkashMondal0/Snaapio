import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system'
import { Assets } from '@/types';
import { uploadFileToSupabase } from './SupaBase-uploadFile';
const qualityArray = [
    { value: 0.2, name: "low" },
    { value: 0.4, name: "medium" },
    { value: 0.8, name: "high" },
    { value: 0.08, name: "blur" },
    { value: 0.1, name: "thumbnail" }
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
    const compressedImage = await manipulateAsync(image, [], {
        compress: QualityFu(quality),
        format: SaveFormat.WEBP,
        base64: true,
    });
    return compressedImage;
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
}): Promise<Assets["urls"] | []> => {
    let arr: Assets["urls"] = [];
    await Promise.all(qualityArray.map(async (quality) => {
        const CompressedImage = await manipulateAsync(image, [], {
            compress: quality.value,
            format: SaveFormat.WEBP,
            base64: true,
        });
        if (!CompressedImage) return;
        // upload the compressed image to the server storage and get the url
        const fileUrl = await uploadFileToSupabase(CompressedImage, "image/webp");
        if (!fileUrl) return;
        arr.push({ [quality.name]: fileUrl });
    }))
    return arr;
};
