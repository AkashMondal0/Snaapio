import { FlashList } from '@shopify/flash-list';
import chatList from "@/data/chatlist.json"
import { memo } from 'react';
import { View } from '@/components/skysolo-ui';

const MessageList = () => {

    return <FlashList
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item, index) => index.toString()}
        scrollEventThrottle={400}
        estimatedItemSize={100}
        data={chatList} />
}

export default MessageList

const Item = memo(function (props) {

    console.log(props)

    return <View>

    </View>
})