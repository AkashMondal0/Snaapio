import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { Icon } from '@/components/skysolo-ui';
import { Input, Text } from 'hyper-native-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';
import { useNavigation } from '@react-navigation/native';

const ListHeader = memo(function ListHeader({
    pageToNewChat,
    InputOnChange
}: {
    pageToNewChat: () => void,
    InputOnChange: (text: string) => void
}) {
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)
    const navigation = useNavigation();

    const PressBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack()
        } else {
            navigation.navigate("HomeTabs")
        }
    }, [])
    return <>
        <View style={{
            paddingHorizontal: 14,
            paddingBottom: 10,
        }}>
            <View style={{
                width: "100%",
                display: "flex", flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 16,
            }}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                }}>
                    <Icon iconName={"ArrowLeft"} size={30} onPress={PressBack} />
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: "400",
                        }}>
                        @{session?.username}
                    </Text>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <Icon iconName={"SquarePen"} size={26} onPress={pageToNewChat} />
                </View>
            </View>
            <Input
                onChangeText={InputOnChange}
                // variant="secondary"
                style={{ borderWidth: 0 }}
                placeholder='Search' />
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "500",
                    lineHeight: 20,
                    paddingTop: 16,
                    paddingHorizontal: 10,
                }}>
                Messages
            </Text>
        </View>
    </>
}, (() => true))

export default ListHeader;