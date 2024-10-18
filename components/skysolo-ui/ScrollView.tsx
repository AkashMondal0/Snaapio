import { RootState } from '@/redux-stores/store';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { useSelector } from "react-redux"

export type Props = ScrollViewProps & {
    variant?: any
    lightColor?: string;
    darkColor?: string;
};


const SkysoloScrollView = ({ style, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    if (!currentTheme) return null
    return (
        <ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='handled'
            style={[{ backgroundColor: currentTheme.background }, {
                flex: 1,
                width: '100%',
                height: '100%',
                minHeight: '100%',
            }]} {...otherProps} />
    )
}

export default SkysoloScrollView