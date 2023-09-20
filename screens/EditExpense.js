import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Form } from "../components";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";
import { fetchExpenseById } from "../database/database";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import EditForm from "../components/UI/EditForm";

const EditExpense = ({ navigation, route }) => {
  const [expenseData, setExpenseData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const id = route.params.id;
  console.log(id);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleBackPress}>
          <Icon
            type="AntDesign"
            name="arrowleft"
            size={24}
            color={Colors.gray100}
          />
        </TouchableOpacity>
      ),
      headerTitleStyle: { color: Colors.gray100 },
      headerStyle: { backgroundColor: Colors.primary100 },
      headerShadowVisible: false,
      title: "編輯頁面",
    });
  }, [navigation]);

  useEffect(() => {
    fetchExpenseById(id)
      .then((data) => {
        setExpenseData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return <EditForm screenType={expenseData.type} expenseData={expenseData} />;
};

export default EditExpense;

const styles = StyleSheet.create({});
