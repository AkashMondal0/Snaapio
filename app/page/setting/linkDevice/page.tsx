import { Animated, Button, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatedContext } from '../../../../provider/Animated_Provider'
import { RootState } from '../../../../redux/store'
import socket from '../../../../utils/socket-connect'
import MyButton from '../../../../components/shared/Button'
import { Scan, ScanLine } from 'lucide-react-native'
import { BarCodeScanner } from 'expo-barcode-scanner';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet'
import ActionSheet from '../../../../components/shared/ActionSheet'
import Icon_Button from '../../../../components/shared/IconButton'
interface LinkDeviceProps {
    navigation?: any
}
const LinkDevice = ({ navigation }: LinkDeviceProps) => {
    const [hasPermission, setHasPermission] = useState(null) as any;
    const AnimatedState = useContext(AnimatedContext)
    const [scanned, setScanned] = useState(false) as any;
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const authToken = useSelector((state: RootState) => state.authState.token);
    const [modalVisible, setModalVisible] = useState(false) as any;

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["10%", "100%"], [])

    const handleBarCodeScanned = ({ type, data }: {
        type: string,
        data: string
    }) => {
        setScanned(true);
        if (data) {
            socket.emit('qr_code_sender', {
                socketId: data,
                token: authToken
            });
            ToastAndroid.show("Device Linked Success", ToastAndroid.SHORT)
            navigation.goBack()
        } else {
            ToastAndroid.show("Invalid QR Code", ToastAndroid.SHORT)
        }
    };



    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
        setModalVisible(true)
    }, [])

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor: AnimatedState.backgroundColor,
            alignItems: 'center',
        }}>
            {modalVisible ? <BarCodeScanner style={{
                flex: 1,
                aspectRatio: 16 / 9,
                width: "100%",
            }} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Scan size={300}
                        strokeWidth={0.5}
                        color={"white"} />
                </View>
            </BarCodeScanner> : <></>}
            <BottomSheet
                backgroundStyle={{
                    backgroundColor: useTheme.background
                }}
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={(index) => {
                    if (index === 0) {
                        setModalVisible(true)
                    } else {
                        setModalVisible(false)
                    }
                }}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}>

                    <Text style={{
                        color: useTheme.textColor
                    }}>Scan the QR Code to link your device</Text>

                </View>
            </BottomSheet>
        </Animated.View>
    )
}

export default LinkDevice