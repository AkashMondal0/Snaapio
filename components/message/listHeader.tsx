import React, { memo } from 'react';
import { View } from 'react-native';
import { Icon, Input, Text } from '@/components/skysolo-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-stores/store';

const ListHeader = memo(function ListHeader({
    pressBack,
    pageToNewChat,
    InputOnChange
}: {
    pageToNewChat: () => void,
    pressBack: () => void,
    InputOnChange: (text: string) => void
}) {
    const session = useSelector((Root: RootState) => Root.AuthState.session.user)

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
                    <Icon iconName={"ArrowLeft"} size={30} onPress={pressBack} />
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
                secondaryColor
                style={{ borderWidth: 0 }}
                placeholder='Search' />
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "500",
                    lineHeight: 20,
                    paddingTop: 16,
                    paddingHorizontal: 10,
                }}
                variant="heading4">
                Messages
            </Text>
        </View>
    </>
}, (() => true))

export default ListHeader;