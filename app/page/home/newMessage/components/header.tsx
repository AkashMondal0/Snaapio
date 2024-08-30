import { FC, memo, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, Animated, StatusBar } from 'react-native';
import React from 'react';
import { CurrentTheme } from '../../../../../types/theme';
import Padding from '../../../../../components/shared/Padding';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
    theme: CurrentTheme
    navigation?: any
    AnimatedState?: any
    label?: string
    items: React.ReactNode
    onBackPress?: () => void
}
const Header: FC<HeaderProps> = ({
    theme,
    navigation,
    AnimatedState,
    label,
    items,
    onBackPress
}) => {

    return (
        <>
            <Padding size={StatusBar.currentHeight} />
            <Animated.View style={{
                elevation: 0,
                height: 60,
                paddingHorizontal: 15,
                backgroundColor: AnimatedState.backgroundColor,
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 60,
                }}>
                    <TouchableOpacity
                        onPress={()=>navigation.goBack()}>
                        <ArrowLeft
                            size={25}
                            color={theme.iconColor}
                        />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        color: theme.primaryTextColor,
                    }}>
                        {label ? label : "No Title"}
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                    }}>
                        {items}
                    </View>
                </View>

            </Animated.View>
        </>
    );
};

export default memo(Header);