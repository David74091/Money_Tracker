import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import Icon from "../../components/UI/Icon";

const Keyboard = ({ setShowKeyboard, fetchAmountNumber }) => {
  const [num, setNum] = useState("");
  //是否按下運算符
  const [caculating, setCaculating] = useState(false);

  //運算時儲存前一筆數字
  const [preValue, setPreValue] = useState("");

  //螢幕目前顯示的數字
  const [displayValue, setDisplayValue] = useState("");

  //點擊哪個運算符號
  const [operator, setOperator] = useState("");

  //上一頁Form的螢幕顯示
  useEffect(() => {
    fetchAmountNumber(displayValue);
  }, [displayValue]);

  // 處理數字按鈕的點擊事件
  const handleNumberPress = (number) => {
    if (displayValue == "0") {
      setDisplayValue(number);
    } else if (operator === "=") {
      setDisplayValue(number);
      setPreValue("");
      setOperator("");
    } else {
      setDisplayValue(displayValue + number);
    }
  };

  // 處理運算符按鈕的點擊事件
  const handleOperatorPress = (op) => {
    setCaculating(true);
    if (preValue !== "" && displayValue !== "") {
      let result;
      switch (operator) {
        case "+":
          result = parseFloat(preValue) + parseFloat(displayValue);
          break;
        case "mul":
          result = parseFloat(preValue) * parseFloat(displayValue);
          break;
        default:
          break;
      }
      setPreValue(result.toString());
      setDisplayValue("");
    } else if (preValue !== "") {
      setDisplayValue("");
    } else {
      setPreValue(displayValue);
      setDisplayValue("");
    }
    setOperator(op);
  };
  const handleEqualPress = () => {
    setCaculating(false);
    if (preValue !== "" && displayValue !== "") {
      let result;
      switch (operator) {
        case "+":
          result = parseFloat(preValue) + parseFloat(displayValue);
          break;
        case "mul":
          result = parseFloat(preValue) * parseFloat(displayValue);
          break;
        default:
          break;
      }
      setDisplayValue(result.toString());
      setPreValue("");
      setOperator("=");
    }
  };

  // 清空螢幕上的數字和相關狀態
  const handleClearPress = () => {
    console.log("Clear button pressed"); // 添加這行
    setDisplayValue("0");
    setPreValue("");
    setOperator("");
  };

  return (
    <View style={{ height: "70%", backgroundColor: Colors.primary100 }}>
      <View style={styles.keyboardContainer}>
        <View style={styles.col}>
          <Pressable
            onPress={() => handleNumberPress("1")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>1</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress("4")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>4</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress("7")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>7</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress(".")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>.</Text>
          </Pressable>
        </View>
        <View style={styles.col}>
          <Pressable
            onPress={() => handleNumberPress("2")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>2</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress("5")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>5</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress("8")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>8</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress("0")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>0</Text>
          </Pressable>
        </View>
        <View style={styles.col}>
          <Pressable
            onPress={() => handleNumberPress("3")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>3</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress("6")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>6</Text>
          </Pressable>
          <Pressable
            onPress={() => handleNumberPress("9")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>9</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDeletePress("delete")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>
              <Icon
                type="Feather"
                name="delete"
                size={36}
                color={Colors.gray100}
              />
            </Text>
          </Pressable>
        </View>
        <View style={styles.col}>
          <Pressable
            onPress={() => handleOperatorPress("+")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>+</Text>
          </Pressable>
          <Pressable
            onPress={() => handleOperatorPress("mul")}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.text}>×</Text>
          </Pressable>
          <Pressable
            onPress={handleClearPress}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: Colors.error },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.text, { color: "white" }]}>AC</Text>
          </Pressable>
          <Pressable
            onPress={
              caculating ? handleEqualPress : () => setShowKeyboard(false)
            }
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: Colors.sucess },
              pressed && styles.pressed,
              ,
              caculating && { backgroundColor: "#30a9de" },
            ]}
          >
            <Text style={[styles.text, { color: "white" }]}>
              {caculating ? "=" : "完成"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Keyboard;

const styles = StyleSheet.create({
  keyboardContainer: {
    padding: 10,
    backgroundColor: Colors.primary200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    height: 100,
    width: 83,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.gray100,
  },
  col: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  pressed: {
    opacity: 0.7,
  },
});
