import { useNavigation } from "@react-navigation/native";
import { useTheme, Text, Button } from "hyper-native-ui";
import { View } from "react-native";
import { Avatar } from "../skysolo-ui";

const VerifiedAdComponent = ({ verified }: { verified: boolean }) => {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    
    return <View style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 18,
        flexDirection: "column",
        gap: 4,
        alignItems: "flex-start",
        backgroundColor: currentTheme.input,
        borderWidth: 0.8,
        borderColor: currentTheme.ring,
        display: verified ? 'none' : 'flex',
    }}>
        <View style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 4,
        }}>
            <Text
                variant="H6"
                numberOfLines={1}
                style={{
                    textAlign: "left",
                    fontWeight: 'bold',
                    marginBottom: 2,
                    flexShrink: 1,
                }}
            >
                You aren’t verified yet
            </Text>

            <Avatar
                size={24}
                style={{
                    backgroundColor: "transparent",
                    display: !verified ? 'flex' : 'none',
                }}
                serverImage={false}
                touchableOpacity={false}
                source={require('../../assets/images/verified.png')}
            />
        </View>

        <Text
            variant="caption"
            style={{
                textAlign: "left",
                marginBottom: 14,
            }}>
            Upgrade to premium to get verified and unlock other features.
        </Text>

        <Button
            style={{ borderRadius: 100 }}
            onPress={() => {
                navigation.navigate("PremiumSignUpScreen")
            }}>
            Upgrade to premium
        </Button>
    </View>;
}

export default VerifiedAdComponent;