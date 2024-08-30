
import React, { FC, createContext, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Theme, Theme_Toggle_State, changeTheme } from '../redux/slice/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated, Button, Dimensions } from 'react-native';

interface AnimatedContextType {
    SearchList_on?: () => void,
    SearchList_off?: () => void,
    SearchList_Width?: any,
    // theme mode
    changeThemeMode?: (theme: Theme) => void
    ThemeState?: Theme_Toggle_State
    backgroundColor?: any
    primaryBackgroundColor?: any
}

const AnimatedContext = createContext<AnimatedContextType>({});

export { AnimatedContext };

interface Animated_ProviderProps {
    children: React.ReactNode
}

const Animated_Provider: FC<Animated_ProviderProps> = ({
    children
}) => {
    const windowWidth = Dimensions.get('window').width;
    const dispatch = useDispatch()
    const ThemeState = useSelector((state: RootState) => state.ThemeMode)
    const SearchList_Width = useRef(new Animated.Value(0)).current;

    const SearchList_on = useCallback(() => {
        Animated.timing(
            SearchList_Width,
            {
              toValue: windowWidth, // Final value of width
              duration: 500, // Duration of animation in milliseconds
              useNativeDriver: false, // Add this line
            }
          ).start();
    }, [])

    const SearchList_off = useCallback(() => {
        Animated.timing(
            SearchList_Width,
            {
              toValue: 0, // Final value of width
              duration: 500, // Duration of animation in milliseconds
              useNativeDriver: false, // Add this line
            }
          ).start();
    }, [])

   // new theme mode
    const animatedValue = useRef(new Animated.Value(0)).current;
    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [ThemeState.lightMode.background, ThemeState.darkMode.background], // interpolate from red to green
    });
    const primaryBackgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange:  [ThemeState.lightMode.primaryBackground, ThemeState.darkMode.primaryBackground] , // interpolate from red to green
    });

    const changeLightColor = () => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false, // color interpolation is not supported on native driver
        }).start();
    };

    const changeDarkColor = () => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    };

    const changeThemeMode = useCallback((themeValue: Theme) => {

        switch (themeValue) {
            case "light":
                changeLightColor()
                dispatch(changeTheme("light"))
                break;
            case "dark":
                changeDarkColor()
                dispatch(changeTheme("dark"))
                break;
            default:
                dispatch(changeTheme("system"))
                break;
        }
    }, [])

    useEffect(() => {
        AsyncStorage.getItem('my-theme').then((value) => {
            changeThemeMode(value as Theme)
        })
    }, [])

    return (
        <AnimatedContext.Provider value={{
            SearchList_on,
            SearchList_off,
            SearchList_Width,
            // theme mode
            changeThemeMode,
            ThemeState,
            backgroundColor,
            primaryBackgroundColor
        }}>
            {children}
        </AnimatedContext.Provider>
    );
};

export default Animated_Provider;


interface SearchListType {
    width: string | number | undefined | any,
    height: string | number | undefined | any,
    radius: string | number | undefined | any,
}