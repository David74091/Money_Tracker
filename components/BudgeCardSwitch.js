import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Colors } from "../constants/Colors";
import { BudgeContext } from "../store/budge-context";
import { fetchBudge, updateShowOnMainScreen } from "../database/database";

const BudgeCardSwitch = () => {
  const [showBudgeCard, setShowBudgeCard] = useState(true);
  useEffect(() => {
    fetchBudge()
      .then((data) => {
        setShowBudgeCard(!!data.showOnMainScreen);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleSwitch = async () => {
    await updateShowOnMainScreen(!showBudgeCard);
    setShowBudgeCard(!showBudgeCard);
  };
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.text}>主頁顯示預算</Text>
      <Switch
        trackColor={{ false: "#767577", true: Colors.primary200 }}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={showBudgeCard}
      />
    </View>
  );
};

export default BudgeCardSwitch;

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
