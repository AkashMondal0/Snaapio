import { Text, Button } from '@/components/skysolo-ui'
import React, { useRef, useEffect } from 'react'
import { View } from 'react-native'
import LottieView from 'lottie-react-native';
export default function InitialScreen({ navigation }: any) {
    const animation = useRef<LottieView>(null);
    useEffect(() => {
        animation.current?.play();
    }, []);
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
                    fontFamily="Satisfy"
                    style={{
                        fontSize: 40,
                        fontWeight: "bold",
                    }}>
                    Skylight
                </Text>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                        width: 300,
                        height: 300,
                        alignContent: "center",
                    }}
                    source={require('../../assets/lottie/Animation - 1727195986028.json')}
                />
            </View>
            <Text style={{
                fontSize: 25,
                fontWeight: "bold",
                marginVertical: 8,
            }}>
                Welcome to Skylight
            </Text>
            <Text
                style={{
                    marginVertical: 8,
                    marginHorizontal: 20,
                    fontSize: 14,
                    textAlign: "center",
                }}>
                Skylight is a social media platform for sharing your thoughts and ideas with the world.
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
        </View>
    )
}
