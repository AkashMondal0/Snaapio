import { View, Text, Button, Card, Switch, CheckBox } from "@/components/skysolo-ui";
import { memo } from "react";


const FeedsScreen = memo(function FeedsScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Card style={{
                width: '80%',
                height: '20%',
            }}>
                <Text variant="heading3">Feed Screen</Text>
            </Card>
            <Switch />
            <CheckBox />
        </View>
    )
})
export default FeedsScreen;