import { RootState } from '@/redux-stores/store';
import { useSelector } from "react-redux"
import React, { useCallback, useState } from 'react';
import { Alert, Modal, View, type ModalProps, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import SkysoloText from './Text';
import SkysoloButton from './Button';

export type Props = ModalProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
    trigger?: React.ReactNode,
    children?: React.ReactNode,
};


const SkysoloModal = (props: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    const clickHandler = useCallback(() => {
        setModalVisible(!modalVisible)
    }, [modalVisible])


    if (!currentTheme) return <View />
    return (
        <View style={{
            backgroundColor: currentTheme.background,
            flex: 1,
        }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                {/* container */}
                <View style={{
                    flex: 1,
                    width: "100%",
                    height: "auto",
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                }}>
                    <View style={{
                        backgroundColor: currentTheme.accent,
                        borderRadius: 20,
                        alignItems: 'center',
                        shadowColor: currentTheme.accent_foreground,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 1,
                        height: 600,
                        borderColor: currentTheme.border,
                        borderWidth: 1,
                    }}>
                        <View style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 5
                        }}>
                            <View style={{
                                borderRadius: 50,
                                opacity: 0.8,
                                width: 30,
                                height: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 5
                            }} />
                            <SkysoloText variant="heading2" style={{ fontWeight: "bold" }}>Container</SkysoloText>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: currentTheme.accent_foreground,
                                    borderRadius: 50,
                                    opacity: 0.8,
                                    borderColor: currentTheme.border,
                                    borderWidth: 0.5,
                                    width: 30,
                                    height: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: 5
                                }}
                                onPress={clickHandler}>
                                <X style={{
                                    //@ts-ignore
                                    color: currentTheme.accent
                                }} />
                            </TouchableOpacity>
                        </View>
                        {props.children}
                    </View>
                </View>
            </Modal>
            <SkysoloButton onPress={clickHandler}>Hello World!</SkysoloButton>
        </View>
    );
};

export default SkysoloModal;