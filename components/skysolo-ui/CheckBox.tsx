import { RootState } from '@/app/redux/store';
import React from 'react'
import BouncyCheckbox, { IBouncyCheckboxProps } from "react-native-bouncy-checkbox";
import { useSelector } from 'react-redux';


export type Props = IBouncyCheckboxProps & {
    lightColor?: string;
    darkColor?: string;
};

const SkySoloCheckBox = ({ ...props }: Props) => {
    const currentTheme = useSelector((state: RootState) => state.ThemeState.currentTheme)

    return (
        <BouncyCheckbox
            {...props}
            size={25}
            fillColor={currentTheme?.primary}
            iconStyle={{ borderColor: currentTheme?.primary }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{ color: currentTheme?.foreground }}
        // textStyle={{ fontFamily: "JosefinSans-Regular" }}
        // onPress={(isChecked: boolean) => { console.log(isChecked) }}
        />
    )
}
export default SkySoloCheckBox