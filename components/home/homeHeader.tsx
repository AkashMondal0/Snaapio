import { View } from "react-native"
import { Text } from '@/components/skysolo-ui';


const HomeHeader = () => {
    return <View>
        <Text variant="heading2" style={{
            fontWeight: "700",
            padding: 10,
            paddingVertical: 14
        }}>SkyLight</Text>
    </View>
}


export default HomeHeader