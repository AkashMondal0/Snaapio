import React from 'react';
import { FlashList } from '@shopify/flash-list';




const SkysoloVirtualizedList = ({ data }: { data: any[] }) => {

    return (<FlashList
        renderItem={({ item }) => {
            return <></>
        }}
        keyExtractor={(item, index) => index.toString() as string}
        scrollEventThrottle={400}
        estimatedItemSize={100}
        data={data} />)
};

export default SkysoloVirtualizedList;