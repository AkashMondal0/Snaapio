import { Text, Button } from "@/components/skysolo-ui";
import { NavigationProps } from "@/types";
import { memo } from "react";
import { View } from "react-native";


const SearchScreen = memo(function SearchScreen({ navigation }: { navigation: NavigationProps }) {
    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <Text variant="heading2">Search Screen</Text>
        </View>
    )
})
export default SearchScreen;