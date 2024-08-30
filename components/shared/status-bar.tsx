import { FC } from 'react';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import React from 'react';
interface MyStatusBarProps {
    translucent?: boolean;
    variant?: "dangers" | "success" | "primary" | "warning" | "info"
}
const MyStatusBar: FC<MyStatusBarProps> = ({
    translucent,
    variant
}) => {
    const Theme = useSelector((state: RootState) => state.ThemeMode)

    // switch (variant) {
    //     case "dangers":
    //         return (<>
    //             <StatusBar

    //                 barStyle={Theme.StatusBar}
    //                 backgroundColor={Theme.currentTheme.DangerButtonColor}
    //                 translucent={translucent} />
    //         </>
    //         )
    //     case "success":
    //         return (<>
    //             <StatusBar
    //                 barStyle={Theme.StatusBar}
    //                 backgroundColor={Theme.currentTheme.background}
    //                 translucent={translucent} />
    //         </>
    //         )
    //     case "primary":
    //         return (<>
    //             <StatusBar
    //                 barStyle={Theme.StatusBar}
    //                 backgroundColor={Theme.currentTheme.background}
    //                 translucent={translucent} />
    //         </>
    //         )
    //     case "warning":
    //         return (<>
    //             <StatusBar
    //                 barStyle={Theme.StatusBar}
    //                 backgroundColor={Theme.currentTheme.background}
    //                 translucent={translucent} />
    //         </>
    //         )
    //     case "info":
    //         return (<>
    //             <StatusBar
    //                 barStyle={Theme.StatusBar}
    //                 backgroundColor={Theme.currentTheme.background}
    //                 translucent={translucent} />
    //         </>
    //         )
    //     default:
    return (<>
        <StatusBar
            barStyle={Theme.StatusBar}
            backgroundColor={"transparent"}
            translucent={translucent} />
    </>
    )

};

export default MyStatusBar;