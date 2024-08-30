import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronRight, CircleDashed, Palette, Pencil, UserRoundPlus } from 'lucide-react-native';
import { CurrentTheme } from '../../../types/theme';
import Avatar from '../../../components/shared/Avatar';


interface Props {
    theme: CurrentTheme
    onPress?: () => void
    name: string
    icon: React.ReactNode
    secondaryIcon: React.ReactNode
    subTitle?: string
    height?: number
}

const ItemCard: React.FC<Props> = ({
    name,
    icon,
    secondaryIcon,
    subTitle,
    height,
    onPress,
    theme
}) => {

    const titleTextSize = 16;
    const textWeight = "500";

    return (
        <>
            <View style={{
                overflow: 'hidden',
                elevation: 0.5,
            }}>
                <Pressable
                    android_ripple={{ color: theme.selectedItemColor, borderless: false, }}
                    style={{
                        backgroundColor: theme.cardBackground,
                        borderRadius: 20,
                        height: height || 70,
                        borderBottomWidth: 0.4,
                        borderBottomColor: theme.borderColor,
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
                            <View style={{
                                backgroundColor: theme.background,
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {icon}
                            </View>
                            <View>
                                <Text style={{
                                    fontSize: titleTextSize,
                                    fontWeight: textWeight,
                                    color: theme.textColor,
                                }}>
                                    {name}
                                </Text>
                                {subTitle && <Text style={{
                                    fontSize: 12,
                                    color: theme.textColor,
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

export default ItemCard