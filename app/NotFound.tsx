import { StyleSheet, View } from 'react-native';

export function NotFound() {
  return (
    <View style={styles.container}>
      {/* <Text>404</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
