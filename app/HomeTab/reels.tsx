import { memo, useCallback } from "react";
import { useTheme } from "hyper-native-ui";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "@/components/skysolo-ui";
import * as Haptics from 'expo-haptics';
import { useNavigation } from "@react-navigation/native";
const Reels = memo(function Reels() {
  const { currentTheme } = useTheme();
  const navigation = useNavigation();

  const HP = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, []);

  const HangUp = useCallback(() => {
    HP();
    navigation.navigate("Video")
  }, []);

  return (
    <View style={{
      display: "flex",
      flexDirection: "row",
      height: 100,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16
    }}>
      <TouchableOpacity onPress={HangUp}
        activeOpacity={0.6}
        style={{
          padding: 15,
          borderRadius: 50,
          aspectRatio: 1 / 1,
          backgroundColor: currentTheme.muted
        }}>
        <Icon iconName="Minimize2" size={24} onPress={HangUp} />
      </TouchableOpacity>
    </View>
  )
})
export default Reels;