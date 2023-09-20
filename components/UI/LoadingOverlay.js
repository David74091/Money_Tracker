import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

const LoadingOverlay = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.gray100} />
    </View>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.primary100,
  },
});
