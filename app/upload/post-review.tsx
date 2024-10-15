import React, { memo } from 'react';
import { Image, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Button, Text } from '@/components/skysolo-ui';
import AppHeader from '@/components/AppHeader';
import { PageProps } from '@/types';

const PostReviewScreen = memo(function PostReviewScreen({
    navigation,
    route
}: PageProps<MediaLibrary.Asset[]>) {
    console.log('PostReviewScreen', route.params.assets);

    return (
        <>
            <AppHeader title="Post" navigation={navigation} titleCenter />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={{ uri: route.params.assets[0].uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                />
            </View>
        </>
    );
}, () => true);

export default PostReviewScreen;