import { FC, memo } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { ArrowLeft, Camera, Settings2, X } from 'lucide-react-native';
import { CurrentTheme } from '../../../../../types/theme';
import Padding from '../../../../../components/shared/Padding';
import MyButton from '../../../../../components/shared/Button';
import Icon_Button from '../../../../../components/shared/IconButton';

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
            <View style={{
                height: 80,
                justifyContent: "center",
                paddingHorizontal: 15,
                alignContent: "space-between",
                paddingTop: StatusBar.currentHeight,
            }}>
                {/* <Padding size={30} /> */}
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
                        <Icon_Button
                            theme={theme}
                            onPress={() => {
                                navigation.goBack()
                            }}
                            size={40}
                            icon={<X
                                size={30} color={theme.iconColor} />} />
                    </Text>
                    {/* <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 15,
                    }}>
                        <Icon_Button
                            theme={theme}
                            onPress={() => { }}
                            size={40}
                            icon={<ArrowLeft
                                size={30} color={theme.iconColor} />} />
                        <TouchableOpacity
                            onPress={() => {
                                AnimatedState.SearchList_on()
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("Setting")
                                }}>
                                <Settings2 size={30} color={theme.iconColor} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        </>
    );
};

export default memo(StatusHeader);