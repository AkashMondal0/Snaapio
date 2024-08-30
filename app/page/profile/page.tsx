import React, { useContext } from 'react'
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { CircleDashed, Pencil } from 'lucide-react-native';
import { RootState } from '../../../redux/store';
import Padding from '../../../components/shared/Padding';
import Avatar from '../../../components/shared/Avatar';
import MyButton from '../../../components/shared/Button';
import { AnimatedContext } from '../../../provider/Animated_Provider';

export default function ProfileScreen() {
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const user = useSelector((state: RootState) => state.profile.user)
    const AnimatedState = useContext(AnimatedContext)
    const titleTextSize = 18;
    const textWeight = "500";
    const textColor = useTheme.textColor;
    const iconColor = useTheme.color;


    const styles = StyleSheet.create({
        container: {
            backgroundColor: useTheme.cardBackground,
            borderRadius: 20,
            width: '95%',
            elevation: 0.4,
        }
    })

    return (
        <Animated.ScrollView style={{
            backgroundColor: AnimatedState.backgroundColor
        }}>
            <Padding size={10} />
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
            }}>
                <View style={[
                    {
                        height: 200,
                        justifyContent: 'center',
                        padding: 10,
                    },
                    styles.container
                ]}>
                    <Avatar
                        text={user?.username}
                        url={user?.profilePicture} size={130} />
                </View>
                <View style={[styles.container, {
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    gap: 10,
                }]}>
                    <View>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: "800",
                            color: textColor,
                        }}>
                            {user?.username}
                        </Text>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: "300",
                            color: textColor,
                        }}>
                            {user?.email}
                        </Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <MyButton
                            icon={<CircleDashed size={20}
                                color={iconColor} />}
                            width={"49%"}
                            fontWeight='bold'
                            variant="warning"
                            radius={25}
                            theme={useTheme}
                            title='Add Status'
                            onPress={() => { }} />
                        <MyButton
                            icon={<Pencil size={20}
                                color={iconColor} />}
                            width={"49%"}
                            fontWeight='bold'
                            variant="warning"
                            onPress={() => { }}
                            radius={25} theme={useTheme} title='Edit Profile' />
                    </View>
                </View>

                {/*  */}
                <View style={[styles.container, {
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    gap: 10,
                }]}>
                    <Text style={{
                        fontSize: titleTextSize,
                        fontWeight: textWeight,
                        color: textColor,
                    }}>
                        About
                    </Text>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: "300",
                        color: textColor,
                    }}>
                        Sky.inc , Akash Mondal 
                    </Text>

                    <Text style={{
                        fontSize: titleTextSize,
                        fontWeight: textWeight,
                        color: textColor,
                    }}>
                        Location
                    </Text>

                    <Text style={{
                        fontSize: 15,
                        fontWeight: "300",
                        color: textColor,
                    }}>
                        coming soon
                    </Text>
                </View>

            </View>

            <Padding size={10} />
        </Animated.ScrollView>
    )
}


