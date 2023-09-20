import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

const Toast = ({ children, width, marginTop }) => {
  return (
    <View
      style={[
        styles.toastContainer,
        width && { width: width, marginTop: marginTop },
      ]}
    >
      <Text style={styles.toastText}>{children}</Text>
    </View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toastContainer: {
    alignSelf: "center",
    borderRadius: 12,
    height: 50,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    // 根據需要調整這個值以控制垂直位置
    zIndex: 1, // 確保 Toast 在 Form 上方
    top: "30%",
  },
  toastText: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: 16,
  },
});
