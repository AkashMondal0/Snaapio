import { View, Text, Button, Card, Switch, Image, CheckBox, Input, Skeleton, VirtualizedList, Modal, Dropdown,Collapsible } from "@/components/skysolo-ui";
import React from "react";
import { memo } from "react";

const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Collapsible title={"akash"} description="akashakashakashakashakashakashakashakashakashakashakashakash"/>
        </View>
    )
})
export default FeedsScreen;