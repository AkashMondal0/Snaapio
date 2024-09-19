import {Text, Image, Button } from '@/components/skysolo-ui'
import React from 'react'
import { View } from 'react-native'

export default function InitialScreen({ navigation }: any) {

    return (
        <View style={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text
                fontFamily="Satisfy"
                style={{
                    fontSize: 50,
                }}>
                Skylight
            </Text>
            <Image source={require("../../assets/images/intro.png")} style={{
                width: 300,
                height: "50%",
                resizeMode: "contain"
            }} />
            <Text style={{
                fontSize: 25,
                fontWeight: "bold",
                marginVertical: 8,
            }}>Welcome to Skylight</Text>
            <Text
                variant='heading4'
                style={{
                    marginVertical: 8,
                    marginHorizontal: 30
                }}>
                Skylight is a social media platform for sharing your thoughts and ideas with the world.
            </Text>

            <Button onPress={() => { navigation.navigate("register") }} style={{
                width: "80%",
                marginVertical: 10,
            }}>
                Register
            </Button>
            <Button variant="secondary" onPress={() => { navigation.navigate("login") }} style={{
                width: "80%",
                marginVertical: 4,
                elevation: 0,
            }}>
                Login
            </Button>
        </View>
    )
}
