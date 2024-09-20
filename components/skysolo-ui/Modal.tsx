import { RootState } from '@/redux-stores/store';
import { useSelector } from "react-redux"
import React, { useCallback } from 'react';
import { Alert, Modal, View, type ModalProps, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import SkysoloText from './Text';

export type Props = ModalProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
    trigger?: React.ReactNode,
    children?: React.ReactNode,
    modalVisible: boolean,
    setModalVisible: (value: boolean) => void
};


const SkysoloModal = ({
    modalVisible,
    setModalVisible,
    children,
    showHeader = false,
    headerTitle = "Container",
    ...props
}: {
    setModalVisible: (value: boolean) => void,
    modalVisible: boolean,
    children: React.ReactNode,
    otherProps?: ModalProps,
    headerTitle?: string,
    showHeader?: boolean
}) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    const clickHandler = useCallback(() => {
        setModalVisible(!modalVisible)
    }, [modalVisible])


    if (!currentTheme) return <View />
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }} {...props}>
                <View style={{
                    flex: 1,
                    width: "100%",
                    height: "auto",
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                }}>
                    {/* container */}
                    <View style={{
                        backgroundColor: currentTheme.accent,
                        borderRadius: 20,
                        alignItems: 'center',
                        marginHorizontal: "auto",
                        shadowColor: currentTheme.accent_foreground,
                        shadowOffset: {
                            width: 0,
                            height: 0.5,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 0.5,
                        borderColor: currentTheme.border,
                        borderWidth: 0.5,
                        minHeight: 280,
                        width: "100%",
                    }}>
                        {showHeader ? <View style={{
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
                        </View> : <></>}
                        {children}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SkysoloModal;