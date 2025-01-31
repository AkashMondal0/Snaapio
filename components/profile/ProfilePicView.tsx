import React from "react";
import { Avatar } from "@/components/skysolo-ui";
import { fetchStoryApi } from "@/redux-stores/slice/account/api.service";
import { disPatchResponse, loadingType, Story, User } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Modal, TouchableOpacity, Vibration } from "react-native";
import { useDispatch } from "react-redux";
import { StackActions, useNavigation } from "@react-navigation/native";

const ProfilePicView = ({ user }: {
    user: User | null
}) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [state, setState] = useState<{
        loading: loadingType,
        error: boolean,
        data: Story[]
    }>({
        data: [],
        error: false,
        loading: "idle",
    })
    const dispatch = useDispatch()

    const fetchApi = useCallback(async () => {
        if (!user?.id) return
        const res = await dispatch(fetchStoryApi(user?.id) as any) as disPatchResponse<any[]>
        if (res.error) return setState({ ...state, loading: "normal", error: true })
        if (res.payload.length > 0) {
            setState({
                ...state,
                loading: "normal",
                data: res.payload,
            })
            return
        }
        setState({ ...state, loading: "normal", error: true })
    }, [user?.id])


    const toggleModal = useCallback(() => {
        if (!modalVisible) {
            Vibration.vibrate(10);
        }
        setModalVisible(!modalVisible);
    }, [modalVisible]);
    const onPress = useCallback(() => {
        navigation.dispatch(StackActions.push("Story", { user }));
    }, [])
    useEffect(() => {
        fetchApi()
    }, [])

    if (!user) return <></>

    return (
        <>
            <Modal
                style={{ flex: 1 }}
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={toggleModal}
                    style={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        alignItems: 'center',
                        paddingTop: "50%",
                        backgroundColor: "rgba(0,0,0,0.9)"
                    }}>
                    <Avatar
                        size={260}
                        touchableOpacity={false}
                        onPress={toggleModal}
                        url={user.profilePicture} />
                </TouchableOpacity>
            </Modal>
            <Avatar
                isBorder={state.data.length > 0}
                size={120}
                onLongPress={toggleModal}
                onPress={state.data.length > 0 ? onPress : undefined}
                TouchableOpacityOptions={{ activeOpacity: 0.9 }}
                url={user.profilePicture} />
        </>
    );
};

export default ProfilePicView;