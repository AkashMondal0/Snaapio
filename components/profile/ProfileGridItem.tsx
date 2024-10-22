import React, { memo } from 'react'
import { View } from 'react-native'
import {Image} from "@/components/skysolo-ui"
import { Post } from '@/types'

const ProfileGridItem = memo(function ProfileGridItem({ item, index }: { item: Post, index: number }) {

    if (!item.fileUrl[0].urls?.high) return <></>
    return (
        <View
            style={{
                width: "33%",
                height: "100%",
                aspectRatio: 1,
            }}>
            <Image
                url={item.fileUrl[0].urls?.high}
                style={{
                    width: '100%',
                    height: "100%",
                    aspectRatio: 1 / 1,
                }} />
        </View>
    )
}, (prev, next) => prev.item.id === next.item.id)

export default ProfileGridItem