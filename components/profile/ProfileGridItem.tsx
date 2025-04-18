import React, { memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Image } from "@/components/skysolo-ui"
import { useNavigation } from "@react-navigation/native";
import { Post } from '@/types'

const ProfileGridItem = memo(function ProfileGridItem({ item, index,
    aspectRatio = 4 / 5
}: {
    item: Post, index: number,
    aspectRatio?: number
}) {
    const navigation = useNavigation();
    if (!item.fileUrl[0].original_sm) return <></>
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                navigation.navigate("Post", { id: item.id })
            }}
            style={{
                width: "33%",
                height: "100%",
                aspectRatio: aspectRatio,
            }}>
            <View style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                opacity: 0.8,
                padding: 4,
            }}>
                {item.fileUrl.length > 1 ? <Icon iconName="Copy" size={26} color="white" /> : <View />}
            </View>
            <Image
                url={item.fileUrl[0].original_sm}
                style={{
                    width: '100%',
                    height: "100%",
                    aspectRatio: aspectRatio,
                }} />
        </TouchableOpacity>
    )
}, (prev, next) => prev.item.id === next.item.id)

export default ProfileGridItem