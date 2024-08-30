import { FC, memo, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import React from 'react';
import { CurrentTheme } from '../../../../types/theme';
import { Camera, Moon, Search, Settings2, Sun } from 'lucide-react-native';

interface StatusHeaderProps {
    theme: CurrentTheme
    navigation?: any
    AnimatedState?: any
}
const StatusHeader: FC<StatusHeaderProps> = ({
    theme,
    navigation,
    AnimatedState,
}) => {

    return (
        <>
            <Animated.View style={{
                elevation: 0,
                height: 60,
                justifyContent: "center",
                paddingHorizontal: 15,
                alignContent: "space-between",
                backgroundColor:AnimatedState.backgroundColor
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        color: theme.primaryTextColor,
                    }}>
                        Status
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                    }}>
                        {/*  */}
                        <TouchableOpacity
                            onPress={() => {
                                AnimatedState.SearchList_on()
                            }}>
                            <Camera  size={30} color={theme.iconColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                AnimatedState.SearchList_on()
                            }}>
                           <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Setting")
                            }}>
                            <Settings2 size={30} color={theme.iconColor}/>
                        </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </>
    );
};

export default memo(StatusHeader);