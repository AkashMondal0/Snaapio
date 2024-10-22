import { RootState } from '@/redux-stores/store';
import { StatusBar, View, type ViewProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
    value?: number;
};


const SkysoloStatusbar = ({ style, value = 1, ...otherProps }: Props) => {
    const themeSchema = useSelector((state: RootState) => state.ThemeState.themeSchema, (prev, next) => prev === next)

    return (
        <StatusBar
            barStyle={themeSchema === "dark" ? "light-content" : "dark-content"}
            backgroundColor="transparent" translucent={true} />
    )
}

export default SkysoloStatusbar