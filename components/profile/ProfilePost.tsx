import { View } from "react-native";
import { Icon } from "../skysolo-ui";
import { loadingType } from "@/types";
import { Text } from "hyper-native-ui"

const ProfileEmptyPosts = ({
    loading
}: { loading: loadingType }) => {
    if (loading === "normal") {
        return <View style={{
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{ height: 50 }} />
            <Icon iconName="Image" size={70} />
            <View style={{ height: 10 }} />
            <Text variant="H4">No Posts yet</Text>
        </View>
    } else {
        return <></>
    }
}

export default ProfileEmptyPosts;