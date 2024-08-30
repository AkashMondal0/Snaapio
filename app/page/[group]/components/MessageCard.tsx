import React, { FC,memo } from 'react';
import { Text, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { CurrentTheme } from '../../../../types/theme';
import { PrivateMessage } from '../../../../types/private-chat';
import { timeFormat } from '../../../../utils/timeFormat';
import { User } from '../../../../types/profile';

interface MessageCardProps {
    content: string;
    sender: boolean
    theme: CurrentTheme
    seen?: boolean
    data?:PrivateMessage
    senderData:User
}
const MessageCard: FC<MessageCardProps> = ({
    content,
    theme,
    sender,
    seen,
    data,
    senderData
}) => {
    const senderColor = theme.primary;
    const receiverColor = theme.cardBackground;
    const textColor = sender ? theme.color : theme.textColor;

    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: sender ? "flex-end" : "flex-start",
            padding: 8,
            // height:200,
        }}>
            <View style={{
                backgroundColor: sender ? senderColor : receiverColor,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderTopLeftRadius: !sender ? 0 : 20,
                borderTopRightRadius: !sender ? 20 : 0,
                padding: 10,
                maxWidth: "80%",
                elevation: 2,
                gap: 5,
            }}>
                {!sender&&<Text style={{
                    color: theme.subTextColor,
                    fontSize: 16,
                    fontWeight: "900",
                }}>
                    {senderData?.username}
                </Text>}
                <Text style={{
                    color: textColor,
                    fontSize: 16,
                    fontWeight: "400",
                }}>
                   {content}
                </Text>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 15,
                }}>
                    <Text style={{
                        color: textColor,
                        fontSize: 12,
                    }}>
                        {
                            timeFormat(data?.createdAt as string)
                        }
                    </Text>
                    {sender?<CheckCheck
                        size={20}
                        color={seen ? theme.seen : theme.iconColor} />:<View style={{width: 20}}></View>}
                </View>
            </View>
        </View>
    );
};

export default memo(MessageCard);