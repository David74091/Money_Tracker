import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Form } from "../components";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";

const AddIncome = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

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
      title: "新增收入",
    });
  }, [navigation]);

  return <Form screenType="income" />;
};

export default AddIncome;

const styles = StyleSheet.create({});
