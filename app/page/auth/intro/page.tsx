import React from 'react'
import { View, Image, StatusBar, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import MyButton from '../../../../components/shared/Button';
import Padding from '../../../../components/shared/Padding';

export default function IntroScreen({ navigation }: any) {
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)

    return (
        <View style={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            // marginTop: StatusBar.currentHeight || 0,
        }}>
            <Text style={{
                fontSize: 40,
                fontWeight: "bold",
                color: useTheme.primary,
                fontFamily: "sans-serif",
                textAlign: "center",
            }}> Next Chat</Text>
            <Image source={require("../../../../assets/images/intro.png")} style={{
                width: 300,
                height: "50%",
                resizeMode: "contain"

            }} />
            <Text style={{
                fontSize: 25,
                fontWeight: "bold",
                color: useTheme.textColor,
                marginBottom: 20,
                textAlign: "center",
            }}>Welcome to Next Chat</Text>
            <Text style={{
                fontSize: 15,
                color: useTheme.textColor,
                marginBottom: 20,
                marginHorizontal: 25,
                textAlign: "center"
            }}>Next Chat is a free messaging app that lets you send messages, photos, videos and files to your contacts!
            </Text>

            <MyButton theme={useTheme}
                onPress={() => {
                    navigation.navigate("register")
                }}
                width={"90%"}
                radius={10}
                fontWeight='bold'
                title={'Register'} />
            <Padding size={10} />
            <MyButton theme={useTheme}
                variant="warning"
                width={"90%"}
                radius={10}
                onPress={() => {
                    navigation.navigate("login")
                }}
                fontWeight='bold'
                title={'logIn'} />
        </View>
    )
}

