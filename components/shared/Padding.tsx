import React from 'react';
import {FC} from 'react';
import { View } from 'react-native';

interface PaddingProps {
    size?: number | undefined ;
    horizontal?: boolean;
}
const Padding:FC<PaddingProps> = ({
    size,
    horizontal
}) => {
  return (
    <View style={{
        height: size || 20,
        width: horizontal ? size : undefined,
    }}>
        
    </View>
  );
};

export default Padding;