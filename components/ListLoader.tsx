import { Dimensions, View } from "react-native";
import { Loader, Text } from "@/components/skysolo-ui";


const ListLoader = () => {
    const windowHeight = Dimensions.get('window').height;
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: windowHeight - 400,
            width: '100%',
            flex: 1,
        }}>
            <Loader size={40} />
        </View>
    )
}

export default ListLoader;