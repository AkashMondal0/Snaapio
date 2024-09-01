import { View, Text, Button } from "@/components/skysolo-ui";
import { memo } from "react";


const SearchScreen = memo(function SearchScreen({ navigation }: any) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <Button onPress={() => { navigation?.navigate("message") }}>
                Go to Home
            </Button>
            <Text variant="heading2">Search Screen</Text>
        </View>
    )
})
export default SearchScreen;