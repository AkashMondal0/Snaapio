import React from 'react';
import { View } from 'react-native';
import { useTheme } from "hyper-native-ui";

const ConversationLoader = ({ size }: { size?: number }) => {
    const { currentTheme } = useTheme();
    const background = currentTheme.input;
    return <>
        {Array(12).fill(0).map((_, i) => <View
            key={i}
            style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                width: '100%',
                gap: 10,
                justifyContent: 'space-between',
            }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                width: '65%',
            }}>
                <View style={{
                    width: 55,
                    height: 55,
                    borderRadius: 100,
                    backgroundColor: background
                }} />
                <View style={{ paddingHorizontal: 2 }}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                    }}>
                        <View style={{
                            gap: 5
                        }}>
                            <View style={{
                                width: 180,
                                height: 14,
                                borderRadius: 100,
                                backgroundColor: background
                            }} />
                            <View style={{
                                width: 120,
                                height: 12,
                                borderRadius: 10,
                                backgroundColor: background
                            }} />
                        </View>
                    </View>
                </View>
            </View>
        </View>)}
    </>
}

export default ConversationLoader;