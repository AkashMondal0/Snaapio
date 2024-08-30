import { FC } from 'react';
import { Image, Text, View } from 'react-native';
import React from 'react';
import { CurrentTheme } from '../../../../types/theme';

interface NoItemProps {
    them?: CurrentTheme
}
const NoItem: FC<NoItemProps> = ({
    them
}) => {

    return (
        <View style={{
            borderRadius: 20,
            overflow: 'hidden',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            aspectRatio: 9 / 16,
            flex: 1,
        }}>
            <Image
                source={require('../../../../assets/images/nochat.png')}
                style={{
                    width: '80%',
                    resizeMode: 'contain',
                }}
            />

            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: them?.textColor
            }}>No Chat</Text>
        </View>
    )
};

export default NoItem;