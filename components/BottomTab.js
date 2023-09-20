import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "./UI/Icon";
import { Colors } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";

const BottomTab = () => {
  const navigation = useNavigation();

  const handleTabPress = (tab) => {
    navigation.navigate(tab);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.sucess }]}
          onPress={() => handleTabPress("AddIncome")}
        >
          <Icon
            type="AntDesign"
            name="arrowdown"
            size={34}
            color={Colors.gray100}
          />
        </TouchableOpacity>
        <Text style={styles.text}>收入</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.error }]}
          onPress={() => handleTabPress("AddExpense")}
        >
          <Icon
            type="AntDesign"
            name="arrowup"
            size={34}
            color={Colors.gray100}
          />
        </TouchableOpacity>
        <Text style={styles.text}>支出</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => handleTabPress("ChartScreen")}
          style={styles.button}
        >
          <Icon
            type="Feather"
            name="bar-chart-2"
            size={34}
            color={Colors.gray100}
          />
        </TouchableOpacity>
        <Text style={styles.text}>統計</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => handleTabPress("Settings")}
          style={styles.button}
        >
          <Icon
            type="Feather"
            name="settings"
            size={34}
            color={Colors.gray100}
          />
        </TouchableOpacity>
        <Text style={styles.text}>設定</Text>
      </View>
    </View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary100,
    height: 68,
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 10,
    color: Colors.gray100,
    fontSize: 16,
  },
});
