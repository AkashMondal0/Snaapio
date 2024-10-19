import { RootState } from '@/redux-stores/store';
import { ActivityIndicator, View, type ActivityIndicatorProps } from 'react-native';
import { useSelector } from "react-redux"
import React from 'react';
import { Text } from 'react-native';

export type Props = ActivityIndicatorProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloLoader = (Props: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme?.primary)

    if (!currentTheme) return <></>
    return (
        <ActivityIndicator {...Props} color={currentTheme} />
    )
}

export default SkysoloLoader

export const PageLoader = ({ loading, text }: { loading: boolean, text?: string }) => {
    return (
        <View style={{
            position: "absolute",
            width: "100%",
            height: "120%",
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            display: loading ? "flex" : "none"
        }}>
            <Text
                style={{
                    textAlign: "center",
                    color: "white",
                    padding: 10,
                    fontSize: 20,
                    fontWeight: "bold"
                }}>
                {text}...
            </Text>
        </View>
    )
}