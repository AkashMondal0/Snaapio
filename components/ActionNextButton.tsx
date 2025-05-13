import { PressableButton } from "hyper-native-ui"
import { memo } from "react"
import { View } from "react-native"
import { Icon } from "./skysolo-ui"

const ActionNextButton = memo(function ActionButton({ onPress }: { onPress: () => void }) {
    return <View style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        elevation: 5
    }}>
        <PressableButton
            style={{ padding: 10, borderRadius: 100, borderWidth: 2 }}
            radius={100} onPress={onPress}>
            <Icon
                onPress={onPress}
                iconName={"ArrowRight"}
                size={36} />
        </PressableButton>
    </View>
}, () => true)

export default ActionNextButton;