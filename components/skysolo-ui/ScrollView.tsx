import { RootState } from '@/app/redux/store';
import { ScrollView, View, type ViewProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloScrollView = ({ style, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    if (!currentTheme) return null
    return (
        <ScrollView style={[{ backgroundColor: `hsl(${currentTheme.background})` }, {
            flex: 1,
            width: '100%',
            height: '100%',
            minHeight: '100%',
        }]} {...otherProps} />
    )
}

export default SkysoloScrollView