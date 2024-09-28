import { Dimensions, View } from "react-native";
import { Text } from "@/components/skysolo-ui";


const ListEmpty = ({
    text = "No data found"
}: {
    text: string | undefined | null
}) => {
    const windowHeight = Dimensions.get('window').height;
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: windowHeight - 400,
            width: '100%',
            flex: 1,
        }}>
            <Text variant="heading2" >{text}</Text>
        </View>
    )
}

export default ListEmpty;