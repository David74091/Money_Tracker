import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "./UI/Icon";
import { Colors } from "../constants/Colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { deleteAllBudgeData, fetchBudge } from "../database/database";
import {
  addOneMonthToDate,
  addOneYearToDate,
  getFormattedDate,
} from "../util/date";

const EditBudgeCard = () => {
  const isFocused = useIsFocused();
  const [budge, setBudge] = useState();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchBudge()
        .then((data) => {
          setBudge(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log(budge);
  }, [isFocused, active]);

  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate("EditBudge");
  };

  const currentDate = new Date(); // 取得當前日期

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={[
        styles.editBudgeCardContainer,
        budge == null && { justifyContent: "center" },
      ]}
    >
      {budge ? (
        <>
          <TouchableOpacity
            onPress={() => {
              deleteAllBudgeData()
                .then(() => {
                  setActive(!active);
                  console.log("刪除成功");
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            style={{ position: "absolute", right: 15 }}
          >
            <Icon
              type="MaterialIcons"
              name="delete-forever"
              size={32}
              color={Colors.error}
            />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>總額</Text>
            <Text style={styles.budgeAmount}>$ {budge.amount.toString()}</Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              width: "90%",
              borderColor: Colors.gray100,
              opacity: 0.3,
            }}
          />
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.title, { marginBottom: 10 }]}>週期</Text>
            <Text style={styles.budgeDate}>
              {budge.reset == 1
                ? `${getFormattedDate(
                    new Date(budge.startDate)
                  )}始，每月${new Date(budge.endDate)
                    .getDate()
                    .toString()}號重置`
                : budge.type == "year"
                ? `${getFormattedDate(
                    new Date(budge.beginDate)
                  )}-${getFormattedDate(
                    addOneYearToDate(new Date(budge.beginDate))
                  )}`
                : `${getFormattedDate(
                    new Date(budge.beginDate)
                  )}-${getFormattedDate(
                    addOneMonthToDate(new Date(budge.beginDate))
                  )}`}
            </Text>
          </View>
        </>
      ) : (
        <>
          <Icon
            type="Ionicons"
            name="add-circle-outline"
            size={48}
            color={Colors.gray100}
          />
          <Text style={styles.editBudgeCardContainerText}>新增預算</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default EditBudgeCard;

const styles = StyleSheet.create({
  editBudgeCardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    height: 180,
    width: 325,
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  editBudgeCardContainerText: {
    color: Colors.gray100,
    marginTop: 26,
    fontSize: 16,
    fontWeight: "bold",
  },
  budgeAmount: {
    fontWeight: "bold",
    color: Colors.gray100,
    fontSize: 48,
  },
  budgeDate: {
    fontWeight: "bold",
    color: Colors.gray100,
    fontSize: 18,
  },
  title: {
    color: Colors.gray100,
    fontWeight: "bold",
    opacity: 0.5,
  },
});
