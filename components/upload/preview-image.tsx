import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Image } from '@/components/skysolo-ui';
import { Plus } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';

export const PreviewImage = memo(function ImagePreview({
    assetUrl,
    id,
    handleDelete,
    isServerImage = false
}: {
    assetUrl: string | null | undefined,
    id: string,
    isServerImage: boolean,
    handleDelete: (i: string) => void
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    if (!assetUrl) return <></>

    return (<TouchableOpacity
        activeOpacity={0.8}
        style={{
            elevation: 0.5,
            width: "100%",
            flex: 1,
            borderRadius: 16,
            aspectRatio: 4 / 5,
            marginHorizontal: 10,
        }}>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { handleDelete(id) }}
            style={{
                position: "absolute",
                zIndex: 1,
                alignItems: "flex-end",
                width: "100%",
            }}>
            <View style={{
                backgroundColor: currentTheme?.muted,
                borderRadius: 100,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                margin: 6,
                elevation: 5,
            }}>
                <Icon
                    iconName="Trash2"
                    color={currentTheme?.foreground} size={20}
                    onPress={() => { handleDelete(id) }} />
            </View>
        </TouchableOpacity>
        <Image
            serverImage={isServerImage}
            url={assetUrl}
            style={{
                width: "auto",
                flex: 1,
                borderRadius: 16,
                aspectRatio: 4 / 5,
                resizeMode: "cover",
                // resizeMode: "contain",
                // aspectRatio: 9 / 16, // story
                // aspectRatio: 16 / 9,  // landscape
                // aspectRatio: 1 / 1, // square
            }} />
    </TouchableOpacity>)
}, (prev, next) => prev.id === next.id && prev.isServerImage === next.isServerImage);

export const AddImage = memo(function AddImage({
    onPress
}: {
    onPress: () => void
}) {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return (<>
        <TouchableOpacity
            activeOpacity={0.8}
            style={{
                flex: 1,
                width: "100%",
                borderRadius: 16,
                aspectRatio: 4 / 5,
                backgroundColor: currentTheme?.muted,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: currentTheme?.border,
                elevation: 0.5,
                marginHorizontal: 10
            }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 60,
                    borderColor: currentTheme?.border,
                    borderWidth: 2,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Plus color={currentTheme?.muted_foreground} size={70} strokeWidth={0.8} />
            </TouchableOpacity>
        </TouchableOpacity>
    </>)
}, () => true);