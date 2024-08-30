import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronRight, CircleDashed, Palette, Pencil, UserRoundPlus } from 'lucide-react-native';
import { CurrentTheme } from '../../types/theme';
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface Props {
    label: string
    icon?: React.ReactNode
    secondaryIcon?: React.ReactNode
    iconBackgroundColor?: string
    avatarUrl?: string
    subTitle?: string
    textColor?: string
    height?: number
    onPress?: () => void
    backgroundColor?: boolean
    elevation?: number
    avatarSize?: number
}

const SingleCard: React.FC<Props> = ({
    // theme,
    label,
    icon,
    secondaryIcon,
    iconBackgroundColor,
    avatarUrl,
    subTitle,
    textColor,
    height,
    onPress,
    backgroundColor = true,
    elevation = 0.5,
    avatarSize = 60,
}) => {
    const theme = useSelector((state: RootState) => state.ThemeMode.currentTheme)

    const titleTextSize = 16;
    const textWeight = "500";

    return (
        <>
            <View style={{
                borderRadius: 20,
                width: '100%',
                overflow: 'hidden',
                elevation: elevation,
            }}>
                <Pressable
                    onPress={onPress}
                    android_ripple={{ color: theme.selectedItemColor, borderless: false, }}
                    style={{
                        backgroundColor: backgroundColor ? theme.cardBackground : theme.background,
                        borderRadius: 20,
                        height: height || 70,
                        justifyContent: 'center',
                    }}>
                    <View style={{
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        gap: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}>
                            {icon ? <View style={{
                                backgroundColor: iconBackgroundColor,
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {icon}
                            </View> :
                                <Avatar url={avatarUrl || ""} size={avatarSize} text={label}/>
                            }
                            <View>
                                <Text style={{
                                    fontSize: titleTextSize,
                                    fontWeight: textWeight,
                                    color: textColor || theme.textColor,
                                }}>
                                    {label}
                                </Text>
                                {subTitle && <Text style={{
                                    fontSize: 12,
                                    color: textColor || theme.textColor,
                                }}>
                                    {subTitle}
                                </Text>}
                            </View>
                        </View>
                        {secondaryIcon}
                    </View>
                </Pressable>
            </View>
        </>
    )
}

export default SingleCard