import { RootState } from '@/redux-stores/store';
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { useSelector } from "react-redux"

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