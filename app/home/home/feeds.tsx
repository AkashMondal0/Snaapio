import { View, Text, Button, Card, Switch, Image, CheckBox, Input, Skeleton, VirtualizedList, Modal } from "@/components/skysolo-ui";
import React from "react";
import { memo } from "react";

const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Modal trigger={<Button>Click</Button>} />
        </View>
    )
})
export default FeedsScreen;