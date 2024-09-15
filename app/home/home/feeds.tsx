import FeedList from "@/components/home/FeedList";
import { View } from "@/components/skysolo-ui";
import React from "react";
import { memo } from "react";

const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <FeedList />
        </View>
    )
})
export default FeedsScreen;