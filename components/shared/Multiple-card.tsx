import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, CircleDashed, Palette, Pencil, UserRoundPlus } from 'lucide-react-native';
import { CurrentTheme } from '../../types/theme';
import Avatar from './Avatar';
import ItemCard from '../../page/setting/components/Item-Card';

interface options {
    name: string
    icon?: React.ReactNode
    secondaryIcon?: React.ReactNode
    iconBackgroundColor?: string
    avatarUrl?: string
    subTitle?: string
    textColor?: string

}
interface Props {
    theme: CurrentTheme
    children: React.ReactNode
}

const MultipleCard: React.FC<Props> = ({
    theme,
    children,
}) => {
    return (
        <>
            <View style={{
                borderRadius: 20,
                width: '100%',
                overflow: 'hidden',
                elevation: 0.5,
                backgroundColor: theme.cardBackground,
            }}>
                {children}
            </View>
        </>
    )
}

export default MultipleCard