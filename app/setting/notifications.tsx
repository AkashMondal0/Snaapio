import React, { useEffect, useState } from "react";
import { memo, useCallback } from "react";
import { useTheme, Text, Switch } from "hyper-native-ui";
import { View } from "react-native";
import AppHeader from "@/components/AppHeader";
import { useDispatch } from "react-redux";

const NotificationsSettingScreen = memo(function HomeScreen() {
    const { changeTheme } = useTheme();
    const dispatch = useDispatch();
    const [isChecked,setIsChecked] = useState(false);

    const onValueChange = useCallback(async (themeName: boolean) => {
        try {
            setIsChecked((pre)=>!pre)
        } catch (error) {
            console.error("Error in setting theme", error);
        }
    }, []);

    useEffect(()=>{},[])



    return (
        <View style={{
            flex: 1,
            width: '100%',
            height: '100%',
        }}>
            <AppHeader
                title="Notifications"
                titleCenter
                key={"setting-page-3"} />
            <View style={{
                width: "95%",
                height: 75,
                padding: 15,
                paddingHorizontal: 20,
                display: 'flex',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <View
                    style={{
                        display: "flex",
                    }}>
                    <Text variant="H6">
                        Notifications
                    </Text>
                      <Text variant="body2">
                        Conversation Notifications
                    </Text>
                </View>
              <Switch isChecked={isChecked} onValueChange={onValueChange} />
            </View>
        </View>
    )
})
export default NotificationsSettingScreen;