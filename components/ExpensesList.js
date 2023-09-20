import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ExpenseItem from "./ExpenseItem";
import { fetchExpenses } from "../database/database";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { DateContext } from "../store/date-context";

const ExpensesList = ({ mainCardType }) => {
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState();
  const { screenDate } = useContext(DateContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      fetchExpenses(screenDate.toString())
        .then((response) => {
          setExpenses(response);
          console.log(expenses[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isFocused, screenDate, navigation]);

  // 根據 mainCardType 過濾支出資料

  const filteredExpenses = expenses
    ? expenses.filter((expense) => expense.type == mainCardType)
    : [];

  return (
    <View style={{ marginTop: 10, flex: 1 }}>
      <FlatList
        data={mainCardType !== "" ? filteredExpenses : expenses}
        keyExtractor={(expense) => expense.id}
        renderItem={({ item }) => {
          return <ExpenseItem expense={item} mainCardType={mainCardType} />;
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ExpensesList;

const styles = StyleSheet.create({});
