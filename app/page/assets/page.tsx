import { Animated, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AnimatedContext } from '../../../provider/Animated_Provider'
import { RootState } from '../../../redux/store'
import { useSelector } from 'react-redux'
import { Assets, User } from '../../../types/profile'
import { Video, ResizeMode } from 'expo-av'
import { Play } from 'lucide-react-native'
import Slider from '@react-native-community/slider';
import Header from './components/header'

interface AssetsScreenProps {
    navigation?: any
    route?: {
        params: {
            asset: Assets,
            user: User,
            time: string
        }

    }
}
const AssetsScreen = ({ navigation, route }: AssetsScreenProps) => {
    const AnimatedState = useContext(AnimatedContext)
    const useTheme = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const video = React.useRef<any>(null);
    const [status, setStatus] = React.useState<any>(null);

    if (route?.params?.asset.type === "video") {
        return (
            <>
                <Header theme={useTheme}
                    name={route.params.user.username}
                    avatarUrl={route.params.user.profilePicture}
                    time={route.params.time}
                    onBackPress={() => {
                        if (status?.isPlaying) {
                            video.current.pauseAsync()
                        }
                        navigation.goBack()
                    }}
                    navigation={navigation} />
                <Animated.View style={{
                    flex: 1,
                    backgroundColor: AnimatedState.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={() => {
                            if (status?.isPlaying) {
                                video.current.pauseAsync()
                            } else {
                                video.current.playAsync()
                            }
                        }}>
                        {
                            !status?.isPlaying ? <View style={{
                                width: 80,
                                height: 80,
                                position: "absolute",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 10,
                                borderRadius: 100,
                            }}>
                                <Play size={60} color={"white"} />
                            </View> : <></>
                        }

                        <Video
                            source={{ uri: route.params.asset.url }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            ref={video}
                            useNativeControls={false}
                            onPlaybackStatusUpdate={status => setStatus(() => status)}
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                            }}
                            resizeMode={ResizeMode.COVER}
                        />
                        <Slider
                            style={{ width: "100%", position: "absolute", bottom: 20 }}
                            minimumValue={0}
                            maximumValue={1}
                            value={
                                status?.isLoaded ? status?.positionMillis / status?.durationMillis : 0
                            }
                            onValueChange={(value) => {
                                if (status?.isLoaded) {
                                    video.current.setPositionAsync(value * status?.durationMillis)
                                }
                            }}
                            minimumTrackTintColor={useTheme.primary}
                            maximumTrackTintColor={useTheme.cardBackground}
                            thumbTintColor={useTheme.primary}
                        />
                    </TouchableOpacity>

                </Animated.View>
            </>

        )
    }

    else if (route?.params?.asset.type === "image") {
        return (
            <>
                <Header theme={useTheme}
                    name={route.params.user.username}
                    avatarUrl={route.params.user.profilePicture}
                    time={route.params.time}
                    onBackPress={() => {
                        navigation.goBack()
                    }}
                    navigation={navigation} />
                <Animated.View style={{
                    flex: 1,
                    backgroundColor: AnimatedState.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image source={{ uri: route.params.asset.url }}
                        style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                        }} />
                </Animated.View>
            </>
        )
    }


    return (
        <Animated.View style={{
            flex: 1,
            backgroundColor: AnimatedState.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Header theme={useTheme}
                navigation={navigation} />
            <Text style={{
                color: useTheme.textColor,
                fontSize: 20,
                fontWeight: 'bold'
            }}>No Assets</Text>

        </Animated.View>
    )
}

export default AssetsScreen