import { memo } from 'react';
import { Assets } from '@/types';
import { Image } from '@/components/skysolo-ui';
import React from 'react';

const FeedItemImage = memo(function ImageItem({ item, index }: { item: Assets, index: number }) {
    return <Image
        key={index}
        isBorder
        url={item.original}
        blurUrl={item.blur_original}
        fastLoad
        style={{
            width: "100%",
            flex: 1,
            borderRadius: 0,
        }} />
}, (prev, next) => {
    return prev.item.id === next.item.id
})

export default FeedItemImage;