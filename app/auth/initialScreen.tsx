import { Text, Button } from 'hyper-native-ui'
import { configs } from '@/configs'
import React from 'react'
import { View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
export default function InitialScreen() {
    const navigation = useNavigation();

    return (
        <View style={{
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

            <Button onPress={() => { navigation.navigate("Register" as any) }} style={{
                width: "80%",
                marginVertical: 10,
            }}>
                Register
            </Button>
            <Button variant="secondary" onPress={() => { navigation.navigate("Login" as any) }} style={{
                width: "80%",
                marginVertical: 4,
                elevation: 0,
            }}>
                Login
            </Button>
        </View>
    )
}
