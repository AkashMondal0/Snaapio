import { View } from "react-native";
import { Button, Icon, Modal, Text } from "@/components/skysolo-ui"


const LogOutDialog = ({
    setModalVisible,
    modalVisible,
    confirm
}: {
    setModalVisible: (value: boolean) => void,
    modalVisible: boolean,
    confirm: () => void
}) => {


    return (
        <Modal setModalVisible={setModalVisible} modalVisible={modalVisible}>
            <View style={{
                flex: 1,
                width: "100%",
                height: "auto",
                paddingHorizontal: 10,
            }}>
                <View style={{
                    padding: 20,
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <Text variant="heading2">
                        Log Out
                    </Text>
                    <Text variant="heading4" colorVariant="secondary">
                        Do you want to log out from the app ?
                    </Text>
                </View>

                <View style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                }}>
                    <Icon iconName="AlertCircle" size={70} />
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'center',
                }}>
                    <Button onPress={() => { setModalVisible(false) }} variant="default">
                        Cancel
                    </Button>
                    <Button variant="danger" onPress={() => {
                        setModalVisible(false)
                        confirm()
                    }}>
                        Log Out
                    </Button>
                </View>
            </View>
        </Modal>
    )
}

export default LogOutDialog;