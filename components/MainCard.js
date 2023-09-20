import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../constants/Colors";
import Toast from "./UI/Toast";
import { fetchExpenses } from "../database/database";
import { DateContext } from "../store/date-context";
import { useIsFocused } from "@react-navigation/native";

const MainCard = ({ setMainCardType }) => {
  const [pressed, setPressed] = useState("");
  const [toastText, setToastText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [data, setData] = useState();
  const { screenDate } = useContext(DateContext);
  const isFocused = useIsFocused();
  const [result, setResult] = useState({ incomeTotal: 0, expenseTotal: 0 });

  useEffect(() => {
    fetchExpenses(screenDate.toString())
      .then((expenses) => {
        setData(expenses);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [screenDate, isFocused]);

  //計算支出與收入加總

  useEffect(() => {
    if (data && isFocused) {
      const calculatedResult = data.reduce(
        (accumulator, item) => {
          if (item.type === "income") {
            accumulator.incomeTotal += parseFloat(item.amount);
          } else if (item.type === "expense") {
            accumulator.expenseTotal += parseFloat(item.amount);
          }
          return accumulator;
        },
        { incomeTotal: 0, expenseTotal: 0 }
      );

      setResult(calculatedResult);
    }
  }, [isFocused, data]);

  const handleCardPress = (press) => {
    setShowToast(true);
    if (pressed !== press && pressed !== "") {
      setPressed("");
      setMainCardType("");
      setToastText("收入+支出");
      setTimeout(() => {
        setShowToast(false);
      }, 1000);
      return;
    } else if (press != pressed) {
      press == "left" ? setToastText("收入") : setToastText("支出");
    }

    press == "left" ? setPressed("left") : setPressed("right");
    press == "left" ? setMainCardType("income") : setMainCardType("expense");

    setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  return (
    <>
      {showToast && (
        <Toast width={120} marginTop={155}>
          {toastText}
        </Toast>
      )}

      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={[
            styles.incomeContainer,
            pressed == "right" && { backgroundColor: "rgba(39,69,85,0.2)" },
          ]}
          onPress={() => handleCardPress("left")}
        >
          <Text
            style={[styles.incomeText, pressed == "right" && { opacity: 0.5 }]}
          >
            $ {result.incomeTotal}
          </Text>
          <Text style={[styles.text, pressed == "right" && { opacity: 0.5 }]}>
            收入
          </Text>
        </TouchableOpacity>
        {/* 分隔線 */}
        <View style={styles.separator} />
        <TouchableOpacity
          style={[
            styles.expenseContainer,
            pressed == "left" && { backgroundColor: "rgba(39,69,85,0.2)" },
          ]}
          onPress={() => handleCardPress("right")}
        >
          <Text
            style={[styles.expenseText, pressed == "left " && { opacity: 0.5 }]}
          >
            $ {result.expenseTotal}
          </Text>
          <Text style={[styles.text, pressed == "left" && { opacity: 0.5 }]}>
            支出
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MainCard;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    width: 342,
    height: 142,
    alignItems: "center",

    marginTop: 31,
    borderRadius: 16,
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  incomeContainer: {
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  incomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.sucess,
  },
  expenseContainer: {
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  expenseText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.error,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.gray100,
  },
  separator: {
    height: "100%",
    width: 2,
    backgroundColor: "rgba(39,69,85,0.1)",
  },
});
