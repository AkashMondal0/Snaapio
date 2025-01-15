import { View } from "react-native";
import { Icon, Modal } from "@/components/skysolo-ui"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-stores/store";
import { setAppPermissionDialog } from "@/redux-stores/slice/dialog";
import { Button, Text } from "hyper-native-ui";


const AppPermissionDialog = ({
    confirm
}: {
    confirm?: () => void
}) => {
    const modalVisible = useSelector((state: RootState) => state.DialogsState.appPermission.visible)
    const dispatch = useDispatch()
    return (
        <Modal
            setModalVisible={() => {
                dispatch(setAppPermissionDialog({ visible: false, data: null }))
            }}
            modalVisible={modalVisible}>
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
                    <Text variant="H4">
                        Permissions
                    </Text>
                    <Text variantColor="secondary">
                        To send media, allow SkySolo to access your photos, media and files on your device.
                    </Text>
                </View>

                <View style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 26,
                    flexDirection: 'row',
                    gap: 10,
                }}>
                    <Icon iconName="Folder" size={50} />
                    <Icon iconName="Plus" size={30} />
                    <Icon iconName="Image" size={50} />
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'center',
                }}>
                    <Button onPress={() => {
                        dispatch(setAppPermissionDialog({ visible: false, data: null }))
                    }} variant="outline">
                        Not Now
                    </Button>
                    <Button variant="default" onPress={() => {
                        dispatch(setAppPermissionDialog({ visible: false, data: null }))
                        confirm && confirm()
                    }}>
                        Continue
                    </Button>
                </View>
            </View>
        </Modal>
    )
}

export default AppPermissionDialog;