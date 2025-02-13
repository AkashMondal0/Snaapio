import { memo } from "react";
import { Button } from "hyper-native-ui";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Reels = memo(function Reels() {
    const nav = useNavigation()

    return (
        <View style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            {/* <Button onPress={() => {
                nav.navigate("Calling")
            }}>
                go
            </Button> */}
        </View>
    )
})
export default Reels;