import React, { Suspense, memo, useCallback, useRef } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from 'react-native'
import { Status, User } from '../../../../types/profile'
import { useDispatch, useSelector } from 'react-redux'
import StatusHeader from './components/header'
import Padding from '../../../../components/shared/Padding'
import { RootState } from '../../../../redux/store'
import { ImagePlus, Play, Send } from 'lucide-react-native'
import MyButton from '../../../../components/shared/Button'
import { CurrentTheme } from '../../../../types/theme'
import * as ImagePicker from 'expo-image-picker';
import uid from '../../../../utils/uuid'
import { Video, ResizeMode } from 'expo-av'


interface StatusScreenProps {
    navigation?: any
    route?: {
        params: {
            assets: Status[],
            user: User,
        }
    }
}
const ViewStatusScreen = ({ navigation, route }: StatusScreenProps) => {
    const dispatch = useDispatch()
    const useThem = useSelector((state: RootState) => state.ThemeMode.currentTheme)
    const profileState = useSelector((state: RootState) => state.profile.user)
    const [selectHeroImage, setSelectHeroImage] = React.useState<Status>(route?.params.assets[0] as Status)
    const userprofile = route?.params.user
    const [assets, setAssets] = React.useState<Status[]>(route?.params.assets || [])
    const statusState = useSelector((state: RootState) => state.statusState)


    const uploadStatus = async () => {

    }

    const Next = useCallback(() => {
        const index = assets.findIndex((item) => item._id === selectHeroImage._id)
        if (index + 1 < assets.length) {
            setSelectHeroImage(assets[index + 1])
        } else {
            navigation.goBack()
        }
    }, [selectHeroImage])


    const Previous = useCallback(() => {
        const index = assets.findIndex((item) => item._id === selectHeroImage._id)
        if (index - 1 >= 0) {
            setSelectHeroImage(assets[index - 1])
        } else {
            navigation.goBack()
        }
    }, [selectHeroImage])

    const deleteStatus = useCallback(() => { }, [])



    return (<View style={{
        flex: 1,
        backgroundColor: useThem.primaryBackground,
    }}>
        <Hero useThem={useThem}
            next={Next}
            previous={Previous}
            selectHeroImage={selectHeroImage} />
        <StatusHeader theme={useThem}
            avatarUrl={userprofile?.profilePicture}
            name={userprofile?.username}
            time={selectHeroImage.createdAt}
            onBackPress={() => {
                navigation.goBack()
            }} />
        <View style={{
            flex: 1,
            alignItems: "center",
            width: "100%",
            height: "100%",
            justifyContent: "flex-end",
        }}>
            <View style={{
                justifyContent: "flex-end",
                width: "100%",
                height: 80,
            }}>
            </View>
            <Text style={{
                color: useThem.textColor,
                fontSize: 20,
                textAlign: "center",
                width: "80%",
            }}>{selectHeroImage.caption || ""}</Text>
            <Padding size={20} />
            {route?.params.user._id !== profileState?._id ?
             <Footer useTheme={useThem}
                selectHeroImage={selectHeroImage}
                assets={assets}
                loading={statusState.fetchLoading}
                // pickImage={pickImage}
                setAssets={setAssets}
                submitStatus={uploadStatus} /> : <></>}
        </View>
    </View>)

}

export default memo(ViewStatusScreen)

const Hero = ({
    useThem,
    selectHeroImage,
    next,
    previous,
}: {
    useThem: CurrentTheme,
    selectHeroImage: Status,
    next?: () => void,
    previous?: () => void,
}) => {
    const video = useRef(null) as any;
    const [status, setStatus] = React.useState({}) as any;

    return <Suspense fallback={
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Text style={{
                color: useThem.textColor,
                fontSize: 20,
            }}>Loading...</Text>
        </View>
    }>
        <>
            <TouchableOpacity style={{
                width: "25%",
                height: "90%",
                position: "absolute",
                left: 0,
                zIndex: 10,
            }} onPress={previous}>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: "25%",
                    height: "90%",
                    position: "absolute",
                    right: 0,
                    zIndex: 10,
                }} onPress={next}
            ></TouchableOpacity>
        </>

        {selectHeroImage.type === "image" ?
            <>
                <Image
                    source={{ uri: selectHeroImage.url }}
                    style={{
                        width: "100%",
                        position: "absolute",
                        resizeMode: "contain",
                        height: "100%",
                    }} />
            </>:
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
                    if (status.isPlaying) {
                        video.current.pauseAsync()
                    } else {
                        video.current.playAsync()
                    }
                }}>
                {
                    !status.isPlaying ? <View style={{
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
                    </View> : null
                }

                <Video
                    source={{ uri: selectHeroImage.url }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    ref={video}
                    shouldPlay
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        aspectRatio: 9 / 16,
                    }}
                    resizeMode={ResizeMode.COVER}
                />
            </TouchableOpacity>
        }
    </Suspense>
}

const Footer = ({ useTheme,
    submitStatus, pickImage,
    assets,
    setAssets,
    selectHeroImage,
    loading,
}: {
    useTheme: CurrentTheme,
    pickImage?: () => void,
    submitStatus: () => void
    assets: Status[]
    setAssets: (data: Status[]) => void
    selectHeroImage: Status
    loading?: boolean
}) => {
    const [reply, setReply] = React.useState("")

    const _color = useTheme.textColor
    const backgroundColor = useTheme.background


    const onChangeText = (text: string) => {
        setReply(text)
    }


    return <>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 8,
            gap: 10,
            zIndex: 100,
        }}>
            <View style={{
                backgroundColor: backgroundColor,
                // width: "85%",
                flex: 1,
                borderRadius: 100,
                flexDirection: "row",
                alignItems: "center",
                maxHeight: 100,
                paddingHorizontal: 10,
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    elevation: 25,
                    gap: 5,
                }}>
                    <TouchableOpacity onPress={pickImage}>
                        <ImagePlus
                            size={25}
                            color={_color}
                        />
                    </TouchableOpacity>
                    <TextInput
                        onChangeText={onChangeText}
                        value={reply}
                        multiline={true}
                        style={{
                            minHeight: 45,
                            width: "85%",
                            borderRadius: 100,
                            color: _color,
                            fontSize: 18,
                            flex: 1,
                        }}
                        placeholder="Reply..."
                        placeholderTextColor={_color} />
                </View>
            </View>
            <MyButton theme={useTheme}
                onPress={submitStatus}
                variant="primary"
                radius={100}
                padding={8}
                width={55}
                elevation={5}
                loading={loading}
                icon={<Send size={30} color={useTheme.color} />} />
        </View>
    </>
}