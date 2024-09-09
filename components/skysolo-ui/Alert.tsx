import { RootState } from '@/redux-stores/store';
import { Alert, Button, View, type ViewProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloAlert = ({ style, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme?.background, (prev, next) => prev === next)
    const showAlert = () =>
        Alert.alert(
            'Alert Title',
            'My Alert Msg',
            [
                {
                    text: 'yes',
                    onPress: () => {},
                    style: "default",
                },
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
            ],
        );
    if (!currentTheme) return <View />
    return (
        <Button title='click' onPress={showAlert} />
    )
}

export default SkysoloAlert