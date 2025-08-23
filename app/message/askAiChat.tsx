import React, { memo, useCallback, lazy, Suspense } from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Icon } from "@/components/skysolo-ui";
import { Text, useTheme } from "hyper-native-ui";
import { Loader } from "hyper-native-ui"; // ✅ use loader for fallback

// 💤 Lazy-load heavy child components
const AiChatScreenInput = lazy(() => import("@/components/message/AiChatInput"));
const AiMessageList = lazy(() => import("@/components/message/AiMessageList"));

const AskAiChatScreen = memo(function AskAiChatScreen() {
  const navigation = useNavigation();

  const PressBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={"padding" }
      style={styles.flex}
    >
      <View style={styles.container}>
        <AskAiChatScreenNavbar pressBack={PressBack} />

        {/* Suspense wrappers for lazy components */}
        <Suspense fallback={<Loader size={30} />}>
          <AiMessageList />
        </Suspense>

        <Suspense fallback={<Loader size={30} />}>
          <AiChatScreenInput />
        </Suspense>
      </View>
    </KeyboardAvoidingView>
  );
});

export default AskAiChatScreen;

/**
 * ===============================
 * NAVBAR COMPONENT
 * ===============================
 */
type NavbarProps = {
  pressBack: () => void;
  typing?: boolean;
};

const AskAiChatScreenNavbar = memo(function AskAiChatScreenNavbar({
  pressBack,
  typing = false,
}: NavbarProps) {
  const { currentTheme } = useTheme();

  return (
    <View
      style={[
        styles.navbar,
        {
          borderColor: currentTheme?.border,
          marginTop: StatusBar.currentHeight ?? 0,
        },
      ]}
    >
      {/* Left section */}
      <View style={styles.leftSection}>
        <Icon iconName="ArrowLeft" size={30} onPress={pressBack} />
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Avatar
              serverImage={false}
              borderWidth={0}
              style={styles.avatar}
              TouchableOpacityOptions={{
                activeOpacity: 0.6,
                style: styles.avatarTouchable,
              }}
              url={require("../../assets/images/ai.png")}
              size={30}
            />
          </View>
          <View>
            <Text style={styles.name} variant="body1">
              Gemini
            </Text>
            <Text
              variantColor="secondary"
              style={styles.subtitle}
              variant="body2"
            >
              {typing ? "Typing..." : "Google AI"}
            </Text>
          </View>
        </View>
      </View>

      {/* Right section */}
      <View style={styles.rightSection}>
        <Icon
          iconName="History"
          isButton
          variant="secondary"
          size={26}
          style={{ elevation: 2 }}
        />
      </View>
    </View>
  );
});

/**
 * ===============================
 * STYLES
 * ===============================
 */
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  navbar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarWrapper: {
    borderWidth: 0,
    borderRadius: 100,
    backgroundColor: "white",
    padding: 6,
  },
  avatar: {
    backgroundColor: "white",
    borderWidth: 0,
    borderColor: "white",
    borderRadius: 100,
  },
  avatarTouchable: {
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  name: {
    fontWeight: "800",
  },
  subtitle: {
    fontWeight: "400",
  },
  rightSection: {
    paddingRight: 10,
  },
});
