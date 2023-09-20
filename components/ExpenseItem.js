import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "../constants/Colors";
import Icon from "./UI/Icon";
import { useNavigation } from "@react-navigation/native";

const ExpenseItem = ({ expense }) => {
  const navigation = useNavigation();
  const handleItemPress = () => {
    navigation.navigate("ItemDetail", { id: expense.id });
  };

  return (
    <TouchableOpacity
      onPress={handleItemPress}
      style={[
        styles.expenseContainer,
        expense.type == "expense"
          ? { borderLeftWidth: 6, borderLeftColor: Colors.error }
          : { borderLeftWidth: 6, borderLeftColor: Colors.sucess },
      ]}
    >
      <Icon
        type={expense.icon.type}
        name={expense.icon.name}
        size={24}
        color={Colors.gray100}
      />
      <Text style={styles.category}>{expense.category}</Text>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail" // 设置截断方式，尾部显示省略号
        style={styles.description}
      >
        {expense.description}
      </Text>
      <Text style={styles.amount}>
        {expense.type == "expense" ? "-" : "+"}
        {expense.amount}
      </Text>
    </TouchableOpacity>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  expenseContainer: {
    position: "relative",
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    alignSelf: "center",
    padding: 20,
    borderRadius: 5,
    height: 70,
    width: 325,
    marginTop: 16,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  category: {
    fontWeight: "bold",
    color: Colors.gray100,
    fontSize: 16,
    marginLeft: 5,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.gray100,
    opacity: 0.7,
    marginLeft: 10,
    width: "60%",
  },
  amount: {
    fontWeight: "bold",
    color: Colors.gray100,
    fontSize: 16,
    position: "absolute",
    right: 20,
  },
});
