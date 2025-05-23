import { View } from "react-native";
import { Icon } from "@/components/skysolo-ui";
import { Button, Modal, Text } from "hyper-native-ui";



const NotificationPermissionDialog = ({
    setModalVisible,
    modalVisible,
    confirm
}: {
    setModalVisible: (value: boolean) => void,
    modalVisible: boolean,
    confirm: () => void
}) => {


    return (
        <Modal
            containerStyle={{ minHeight: "40%" }}
            setModalVisible={setModalVisible} modalVisible={modalVisible}>
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
                    <Text variant="H4" bold={"semibold"}>
                        Log Out
                    </Text>
                    <Text variantColor="secondary">
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
                    <Button onPress={() => { setModalVisible(false) }}
                        variant="outline">
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

export default NotificationPermissionDialog;