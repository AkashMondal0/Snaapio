import React, { memo } from 'react';
import { PageProps } from '@/types';
import { ThemedView } from '@/components/skysolo-ui';

const HighlightUploadScreen = memo(function HighlightUploadScreen({
    navigation,
}: PageProps<any>) {
  
    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
        </ThemedView>
    )
})

export default HighlightUploadScreen;