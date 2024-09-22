import { Text, Button } from "@/components/skysolo-ui";
import { memo } from "react";
import { View } from "react-native";


const CameraScreen = memo(function CameraScreen({ navigation }: any) {
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
            <Text
                fontFamily="Satisfy"
                style={{ fontSize: 20 }}
                variant="heading2">Camera Screen</Text>
        </View>
    )
})
export default CameraScreen;

// import { useState } from 'react';
// import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
// import * as SecureStore from 'expo-secure-store';

// async function save(key, value) {
//   await SecureStore.setItemAsync(key, value);
// }

// async function getValueFor(key) {
//   let result = await SecureStore.getItemAsync(key);
//   if (result) {
//     alert("🔐 Here's your value 🔐 \n" + result);
//   } else {
//     alert('No values stored under that key.');
//   }
// }

// export default function App() {
//   const [key, onChangeKey] = useState('Your key here');
//   const [value, onChangeValue] = useState('Your value here');

//   return (
//     <View style={styles.container}>
//       <Text style={styles.paragraph}>Save an item, and grab it later!</Text>
//       {}

//       <TextInput
//         style={styles.textInput}
//         clearTextOnFocus
//         onChangeText={text => onChangeKey(text)}
//         value={key}
//       />
//       <TextInput
//         style={styles.textInput}
//         clearTextOnFocus
//         onChangeText={text => onChangeValue(text)}
//         value={value}
//       />
//       {}
//       <Button
//         title="Save this key/value pair"
//         onPress={() => {
//           save(key, value);
//           onChangeKey('Your key here');
//           onChangeValue('Your value here');
//         }}
//       />
//       <Text style={styles.paragraph}>🔐 Enter your key 🔐</Text>
//       <TextInput
//         style={styles.textInput}
//         onSubmitEditing={event => {
//           getValueFor(event.nativeEvent.text);
//         }}
//         placeholder="Enter the key for the value you want to get"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingTop: 10,
//     backgroundColor: '#ecf0f1',
//     padding: 8,
//   },
//   paragraph: {
//     marginTop: 34,
//     margin: 24,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   textInput: {
//     height: 35,
//     borderColor: 'gray',
//     borderWidth: 0.5,
//     padding: 4,
//   },
// });
