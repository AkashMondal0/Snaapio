import { memo, useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, Icon, Image } from "@/components/skysolo-ui";
import { Text, Loader } from "hyper-native-ui";
import { AuthorData, Story } from "@/types";
import ErrorScreen from "@/components/error/page";
import { timeAgoFormat } from "@/lib/timeFormat";
import { useTheme } from 'hyper-native-ui';
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useGQObject } from "@/lib/useGraphqlQuery";
import { AQ } from "@/redux-stores/slice/account/account.queries";

interface ScreenProps {
    route: {
        params: { user: AuthorData }
    }
}

const StoryScreen = memo(function StoryScreen({
    route
}: ScreenProps) {
    const { user } = route.params;
    const { currentTheme } = useTheme();
    const { data: story, error, loading } = useGQObject<Story[]>({
        query: AQ.findStory,
        variables: { id: user.id },
    });
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const navigation = useNavigation()
    const totalImages = Array.isArray(story) ? story?.length - 1 : 0
    const data = Array.isArray(story) ? story[currentImageIndex] : null as Story | null

    const PressBack = useCallback(() => { navigation?.goBack() }, [])

    const handleNextImage = useCallback(() => {
        if (currentImageIndex === totalImages) {
            if (navigation.canGoBack()) {
                return navigation.goBack()
            }
        }
        setCurrentImageIndex((prev) => prev + 1)
    }, [currentImageIndex, totalImages])

    const handlePrevImage = useCallback(() => {
        if (currentImageIndex === 0) {
            return
        }
        setCurrentImageIndex((prev) => prev - 1)
    }, [currentImageIndex])

    if (loading === "idle" || loading === "pending") {
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Loader size={50} />
        </View>
    }
    if (loading === "normal" && error) {
        return <ErrorScreen />
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
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
                paddingHorizontal: 8,
            }}>
                {totalImages > 1 ? story?.map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: `${100 / story?.length}%`,
                            height: 2,
                            borderRadius: 4,
                            backgroundColor: currentImageIndex === index ? currentTheme?.primary : currentTheme?.accent,
                        }} />
                )) : <></>}
            </View>
            {/* header */}
            <Header
                PressBack={PressBack}
                user={user}
                time={timeAgoFormat(data?.createdAt)} />
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
                    url={data?.fileUrl ? data?.fileUrl[0].original : null}
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
                    {data?.content}
                </Text>
            </View>
        </View>
    )
})
export default StoryScreen;

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
                    isBorder
                    size={50}
                    url={user?.profilePicture} />
                <View>
                    <Text
                        style={{ fontWeight: "600" }}>
                        {user?.name ?? user?.username}
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