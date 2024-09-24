import { memo } from "react";
import { NavigationProps, User } from "@/types";
import { View } from "react-native";
import { Button } from "@/components/skysolo-ui"


const ProfileActionsButton = memo(function ProfileActionsButton({
    navigation,
    userData,
    isProfile
}: {
    navigation: NavigationProps,
    userData: User | null,
    isProfile: boolean
}) {
    if (isProfile) {
        return (<View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 20,
            gap: 10,
        }}>
            <Button
                textStyle={{
                    fontSize: 14,
                }}
                size="auto"
                variant="secondary" style={{
                    flex: 1,
                    height: 40
                }}>
                Edit Profile
            </Button>
            <Button
                textStyle={{
                    fontSize: 14,
                }}
                size="auto"
                variant="secondary" style={{
                    flex: 1,
                    height: 40
                }}>
                Share Profile
            </Button>
        </View>)
    }
    return (<View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        gap: 10,
    }}>
        <Button size="auto"
            style={{
                flex: 1,
                height: 40
            }}>
            Follow
        </Button>
        <Button
            size="auto"
            variant="secondary" style={{
                flex: 1,
                height: 40
            }}>
            Message
        </Button>
    </View>)
})
export default ProfileActionsButton;
