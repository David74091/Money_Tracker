import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Colors } from "../../constants/Colors";
import { BudgeContext } from "../../store/budge-context";

const ResetSwitch = ({ isReset, setIsReset }) => {
  const toggleSwitch = () => {
    setIsReset(!isReset);
  };

  return (
    <View style={styles.switchContainer}>
      <Text style={styles.text}>預算週期性重置</Text>
      <Switch
        trackColor={{ false: "#767577", true: Colors.primary200 }}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isReset}
      />
    </View>
  );
};

export default ResetSwitch;

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    height: 70,
    width: 325,
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray100,
  },
});
