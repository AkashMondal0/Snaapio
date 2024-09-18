import { RootState } from '@/redux-stores/store';
import { Text, type TextProps } from 'react-native';
import { useSelector } from "react-redux"
import { useFonts } from 'expo-font';

export type Props = TextProps & {
    variant?: "heading1" | "heading2" | "heading3" | "heading4";
    lightColor?: string;
    darkColor?: string;
    secondaryColor?: boolean;
    fontFamily?: "Satisfy" | "Lato" | "Montserrat" | "Nunito" | "Open Sans" | "Playpen Sans" | "Poppins" | "Roboto";
};


const SkysoloText = ({ style, variant, fontFamily = "Roboto", secondaryColor, ...otherProps }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)
    const [loaded, error] = useFonts({
        'Satisfy': require('../../assets/fonts/Satisfy.ttf'),
        'Lato': require('../../assets/fonts/Lato.ttf'),
        'Montserrat': require('../../assets/fonts/Montserrat.ttf'),
        'Nunito': require('../../assets/fonts/Nunito.ttf'),
        'Open Sans': require('../../assets/fonts/Open Sans.ttf'),
        'Playpen Sans': require('../../assets/fonts/Playpen Sans.ttf'),
        'Poppins': require('../../assets/fonts/Poppins.ttf'),
        'Roboto': require('../../assets/fonts/Roboto.ttf'),
    });

    if (!loaded && !error || !currentTheme) {
        return <></>
    }
    return (
        <Text
            style={[{
                color: secondaryColor ? currentTheme.muted_foreground : currentTheme.foreground,
                fontSize: variant === "heading1" ? 32 : variant === "heading2" ? 24 : variant === "heading3" ? 18 : variant === "heading4" ? 16 : 14,
                fontFamily: fontFamily,
                fontWeight: "600"
            }, style]}
            {...otherProps} />
    )
}

export default SkysoloText