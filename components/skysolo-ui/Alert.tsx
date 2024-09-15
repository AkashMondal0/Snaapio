import { Alert, Button, type ViewProps } from 'react-native';

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloAlert = ({ style, ...otherProps }: Props) => {
    const showAlert = () =>
        Alert.alert(
            'Alert Title',
            'My Alert Msg',
            [
                {
                    text: 'yes',
                    onPress: () => { },
                    style: "default",
                },
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
            ],
        );
    return (
        <Button title='click' onPress={showAlert} />
    )
}

export default SkysoloAlert