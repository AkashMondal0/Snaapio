import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar } from "../skysolo-ui";


// ===== Action Button =====
const ActionButton = memo(function ActionButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <View style={styles.actionButtonWrapper}>
      <Avatar
        serverImage={false}
        onPress={onPress}
        borderWidth={0}
        style={styles.avatar}
        TouchableOpacityOptions={{
          activeOpacity: 0.6,
          style: styles.avatarTouchable,
        }}
        url={require("../../assets/images/ai.png")}
        size={42}
      />
    </View>
  );
});

// ===== Styles =====
const styles = StyleSheet.create({
  actionButtonWrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 100,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
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
    padding: 8,
  },
});

export default ActionButton;
