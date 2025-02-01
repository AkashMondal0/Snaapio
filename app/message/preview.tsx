import { memo, useState } from "react";
import { Image } from "@/components/skysolo-ui";
import { ThemedView } from 'hyper-native-ui';
import { Message, NavigationProps } from "@/types";
import AppHeader from "@/components/AppHeader";
import PagerView from "react-native-pager-view";
import { View } from "react-native";

interface ScreenProps {
    navigation: NavigationProps;
    route: {
        params: {
            data: Message
        }
    }
}

const ImagePreviewScreen = memo(function ImagePreviewScreen({ navigation, route }: ScreenProps) {
    const title = route.params?.data?.user?.username || "Image Preview"
    const data = route.params.data
    const [tabIndex, setTabIndex] = useState(0)
    // const imageLength = data.fileUrl.length
    // const navigateToProfile = useCallback(() => {
    //     if (!data.user) return ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT)
    //     navigation.push("profile", { username: data.user.username })
    // }, [data.user])

    return (
        <ThemedView style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader title={title} titleCenter />
            <PagerView
                initialPage={tabIndex}
                onPageSelected={(e) => setTabIndex(e.nativeEvent.position)}
                style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                }}>
                {data.fileUrl.map((item, index) => (<ImageItem key={index} item={item} index={index} />))}
            </PagerView>
        </ThemedView>
    )
})
export default ImagePreviewScreen;

const ImageItem = memo(function ImageItem({ item, index }: { item: any, index: number }) {
    return <View
        style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
        }}>
        <Image
            key={index}
            isBorder
            url={item.urls?.high}
            contentFit="contain"
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 0,
            }} />
    </View>
}, (prev, next) => {
    return prev.item.id === next.item.id
})