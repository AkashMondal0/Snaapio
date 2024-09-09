import React from 'react';
import { View, StyleSheet, ToastAndroid, Button, StatusBar } from 'react-native';

const SkysoloToastAndroid = () => {
    const showToast = () => {
        ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
    };

    const showToastWithGravity = () => {
        ToastAndroid.showWithGravity(
            'All Your Base Are Belong To Us',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    };

    const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
            'A wild toast appeared!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
    };

    return (
        <View style={styles.container}>
            <Button title="Toggle Toast" onPress={() => showToast()} />
            <Button
                title="Toggle Toast With Gravity"
                onPress={() => showToastWithGravity()}
            />
            <Button
                title="Toggle Toast With Gravity & Offset"
                onPress={() => showToastWithGravityAndOffset()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#888888',
        padding: 8,
    },
});

export default SkysoloToastAndroid;