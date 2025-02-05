import { StackActions, useNavigation } from "@react-navigation/native";
import { Text, Button } from "hyper-native-ui";
import { View } from "react-native";

export function NotFound() {
  const navigation = useNavigation();
  return (
    <View style={{
      flex: 1,
      height: '100%',
    }}>
      <View style={{
        flex: 1,
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 10
      }}>
        <Text variant="H4">Conversation not found</Text>
        <Button onPress={() => { navigation.dispatch(StackActions.replace('HomeTabs')) }}>Go To Home</Button>
      </View>
    </View>
  );
}