import { Text, Button ,ThemedView} from '@/components/skysolo-ui'
import { configs } from '@/configs'
import React from 'react'
import { View, Image } from 'react-native'
export default function InitialScreen({ navigation }: any) {
    return (
        <ThemedView style={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Text
                    fontFamily="Satisfy"
                    style={{
                        fontSize: 40,
                        fontWeight: "bold",
                    }}>
                    {configs.AppDetails.name}
                </Text>
                <Image
                    style={{
                        width: 100,
                        height: 100,
                        alignContent: "center",
                        margin: "20%"
                    }}
                    source={require('../../assets/icon.png')}
                />
            </View>
            <Text style={{
                fontSize: 25,
                fontWeight: "bold",
                marginVertical: 8,
            }}>
                Welcome to {configs.AppDetails.name}
            </Text>
            <Text
                style={{
                    marginVertical: 8,
                    marginHorizontal: 20,
                    fontSize: 14,
                    textAlign: "center",
                }}>
                {configs.AppDetails.name} is a social media platform for sharing your thoughts and ideas with the world.
            </Text>

            <Button onPress={() => { navigation.navigate("auth/register") }} style={{
                width: "80%",
                marginVertical: 10,
            }}>
                Register
            </Button>
            <Button variant="secondary" onPress={() => { navigation.navigate("auth/login") }} style={{
                width: "80%",
                marginVertical: 4,
                elevation: 0,
            }}>
                Login
            </Button>
        </ThemedView>
    )
}
