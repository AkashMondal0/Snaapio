import React, { memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Image } from "@/components/skysolo-ui"
import { Post } from '@/types'

const ProfileGridItem = memo(function ProfileGridItem({ item, index,
    onPress
}: {
    item: Post, index: number,
    onPress: (item: Post, index: number) => void
}) {

    if (!item.fileUrl[0].urls?.high) return <></>
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPress(item, index)}
            style={{
                width: "33%",
                height: "100%",
                aspectRatio: 1,
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
                url={item.fileUrl[0].urls?.high}
                style={{
                    width: '100%',
                    height: "100%",
                    aspectRatio: 1 / 1,
                }} />
        </TouchableOpacity>
    )
}, (prev, next) => prev.item.id === next.item.id)

export default ProfileGridItem