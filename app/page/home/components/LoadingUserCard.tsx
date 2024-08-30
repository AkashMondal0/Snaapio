import React from 'react';
import { FC } from 'react';
import { View } from 'react-native';
import { CurrentTheme } from '../../../../types/theme';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
interface LoadingUserCardProps {
    theme: CurrentTheme
}
const LoadingUserCard: FC<LoadingUserCardProps> = ({
    theme
}) => {
    return (
        <View style={{
            paddingHorizontal: 10,
        }}>
            <ContentLoader
                height={70}
                speed={1}
                backgroundColor={theme.primaryBackground}
                foregroundColor={theme.background}
                // viewBox="0 0 380 70"
                style={{
                    width: '100%',
                }}>
                <Rect x="0" y="0" rx="100" ry="100" width="55" height="55" />
                <Rect x="80" y="17" rx="10" ry="10" width="80%" height="20" />
                <Rect x="80" y="40" rx="10" ry="10" width="60%" height="20" />
            </ContentLoader>
        </View>
    );
};

export default LoadingUserCard;