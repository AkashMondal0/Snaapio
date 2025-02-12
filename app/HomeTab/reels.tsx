import { decrement, increment } from "@/redux-stores/slice/counterState";
import { RootState } from "@/redux-stores/store";
import { Button, Text } from "hyper-native-ui";
import { memo } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ReelsScreen = memo(function ReelsScreen() {
    const value = useSelector((state: RootState) => state.CounterState.value);
    const dispatch = useDispatch();
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Text variant="H4">{value}</Text>
            <Button variant="success" onPress={() => dispatch(increment())}>
                Increase
            </Button>
            <View style={{ height: 10 }} />
            <Button variant="danger" onPress={() => dispatch(decrement())}>
                Decrease
            </Button>
        </View>
    )
})
export default ReelsScreen;