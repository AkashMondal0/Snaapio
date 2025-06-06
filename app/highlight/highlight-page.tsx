import { memo, useCallback, useState } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { Avatar, Icon, Image } from "@/components/skysolo-ui";
import { AuthorData, Highlight } from "@/types";
import ErrorScreen from "@/components/error/page";
import { dateFormat } from "@/lib/timeFormat";
import { useTheme, Text } from 'hyper-native-ui';
import { useNavigation } from "@react-navigation/native";
import React from "react";

interface ScreenProps {
    route: {
        params: {
            highlight: Highlight,
            user: AuthorData
        }

    }
}

const HighlightPageScreen = memo(function HighlightPageScreen({
    route
}: ScreenProps) {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const { user, highlight } = route.params;
    const actualLength = highlight.stories?.length ?? 0
    const totalImages = highlight.stories ? highlight?.stories?.length - 1 : 0
    const story = highlight.stories ? highlight?.stories[currentImageIndex] : null
    const PressBack = useCallback(() => {
        if (navigation?.canGoBack()) {
            navigation?.goBack()
        }
    }, [])

    const handleNextImage = useCallback(() => {
        if (currentImageIndex === totalImages) {
            if (navigation.canGoBack()) {
                return navigation.goBack()
            }
        }
        setCurrentImageIndex((prev) => prev + 1)
    }, [currentImageIndex, navigation, totalImages])

    const handlePrevImage = useCallback(() => {
        if (currentImageIndex === 0) {
            return
        }
        setCurrentImageIndex((prev) => prev - 1)
    }, [currentImageIndex])

    if (!highlight?.stories || !story) return <ErrorScreen />

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
            marginTop: StatusBar.currentHeight
        }}>
            <View style={{
                width: "100%",
                display: 'flex',
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 6,
                paddingVertical: 4,
                zIndex: 5,
            }}>
                {totalImages > 1 ? Array.from({ length: actualLength }, (_, index) => (
                    <View
                        key={index}
                        style={{
                            width: `${100 / actualLength}%`,
                            height: 1,
                            borderRadius: 4,
                            backgroundColor: currentImageIndex === index ? currentTheme?.primary : currentTheme?.accent,
                        }} />
                )) : <></>}
            </View>
            {/* header */}
            <Header
                PressBack={PressBack}
                user={user}
                time={story?.createdAt ? dateFormat(new Date(Number(story.createdAt)).toISOString()) : "not found"} />
            <View style={{ height: 62 }} />
            {/* story */}
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                }}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        position: "absolute",
                        left: 0,
                        zIndex: 1,
                        width: "50%",
                        height: "100%",
                    }} onPress={handlePrevImage}>
                </TouchableOpacity>
                <Image
                    contentFit="contain"
                    url={story?.fileUrl ? story?.fileUrl[0].original : null}
                    style={{
                        width: "100%",
                        height: "100%",
                    }} />
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        position: "absolute",
                        right: 0,
                        zIndex: 1,
                        width: "50%",
                        height: "100%",
                    }} onPress={handleNextImage}>
                </TouchableOpacity>
            </View>
            <View style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                display: 'flex',
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                paddingBottom: 20,
            }}>
                <Text>
                    {story?.content}
                </Text>
            </View>
        </View>
    )
})
export default HighlightPageScreen;

const Header = ({
    PressBack,
    user,
    time
}: {
    PressBack: () => void;
    user: AuthorData;
    time: string;
}) => {
    return <View
        style={{
            width: "100%",
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 6,
            paddingHorizontal: 3,
            position: "absolute",
            top: 0,
            zIndex: 2,
            height: 60,
            marginVertical: 6
        }}>
        <View style={{
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
        }}>
            <Icon iconName={"ArrowLeft"} size={30} onPress={PressBack} />
            <View style={{
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
            }}>
                <Avatar
                    size={50}
                    url={user?.profilePicture} />
                <View>
                    <Text
                        style={{ fontWeight: "600" }}>
                        {user?.name}
                    </Text>
                    <Text
                        variantColor="secondary"
                        style={{ fontWeight: "400" }}>
                        {time ?? ""}
                    </Text>
                </View>
            </View>
        </View>
        <View style={{ paddingRight: 10 }}>
            <Icon iconName={"Info"} isButton variant="secondary" size={26} style={{ elevation: 2 }} />
        </View>
    </View>;
}