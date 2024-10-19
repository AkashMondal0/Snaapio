import { Avatar } from "@/components/skysolo-ui";
import { useCallback, useState } from "react";
import { Modal, TouchableOpacity, Vibration } from "react-native";

const ProfilePicView = ({ profilePic }: { profilePic?: string | null }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = useCallback(() => {
        if(!modalVisible) {
            Vibration.vibrate(10);
        }
        setModalVisible(!modalVisible);
    }, [modalVisible]);
    return (
        <>
            <Modal
                animationType="fade"
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
                        url={profilePic} />
                </TouchableOpacity>
            </Modal>
            <Avatar
                size={120}
                onLongPress={toggleModal}
                TouchableOpacityOptions={{ activeOpacity: 0.9 }}
                url={profilePic} />
        </>
    );
};

export default ProfilePicView;