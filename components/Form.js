import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import React, { useState, useRef, useEffect, useContext } from "react";
import { Colors } from "../constants/Colors";
import Icon from "../components/UI/Icon";

import Toast from "../components/UI/Toast";

import CategoryDropdown from "./UI/DropDown/CategoryDropdown";
import AccountDropdown from "./UI/DropDown/AccountDropdown";
import CustomTextInput from "./UI/CustomTextInput";
import { useNavigation } from "@react-navigation/native";
import AdjustText from "./UI/AdJustText";
import { insertExpense } from "../database/database";
import { DateContext } from "../store/date-context";
import DatePickerButton from "./DatePickerButton";
import EditDateButton from "./UI/EditDateButton";

const Form = ({ screenType }) => {
  const { screenDate } = useContext(DateContext);

  useEffect(() => {
    console.log("screenDate", screenDate);
  }, [screenDate]);
  const navigation = useNavigation();
  //選單與按鈕的顯示
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  //Toast顯示
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");

  //是否按下運算符號
  const [opPress, setOpPress] = useState(false);
  //是在進行運算
  const [caculating, setCaculating] = useState(false);
  //運算時儲存前一筆數字
  const [preValue, setPreValue] = useState("");
  //螢幕目前顯示的數字
  const [displayValue, setDisplayValue] = useState("");
  //點擊哪個運算符號
  const [operator, setOperator] = useState("");

  //儲存資料
  const [expense, setExpense] = useState({
    date: "",
    amount: "",
    description: "",
    type: "",
    category: "",
    account: "",
    icon: {
      type: "",
      name: "",
    },
  });

  const [date, setDate] = useState(screenDate.toString());
  const [amount, setAmount] = useState(displayValue);
  useEffect(() => {
    setAmount(displayValue);
  }, [displayValue]);

  const [description, setDescription] = useState("");
  useEffect(() => {
    setDescription(textInputValue);
  }, [textInputValue]);

  const [type, setType] = useState(screenType);
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [icon, setIcon] = useState({
    type: "",
    name: "",
  });

  //customTextInput處理邏輯
  const handleTextChange = (entered) => {
    setTextInputValue(entered);
  };
  //避免鍵盤跳出時，組件重組導致數字歸0
  const handleAmountPress = () => {
    Keyboard.dismiss();

    setCaculating(false);
    setOperator("");

    setShowKeyboard(!showKeyboard);

    setIsAccountDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
  };
  //計算機邏輯
  const handleNumberPress = (number) => {
    // 如果用戶輸入小數點且目前顯示的值為空，則自動更正成 "0."

    if (operator === "=") {
      setDisplayValue(number);
      setOperator("");
    } else if (displayValue === "0" || caculating) {
      setDisplayValue(number);
      setCaculating(false);
    } else {
      // 在已有輸入的情況下，只有當目前顯示的值不包含小數點時，才添加小數點
      if (!displayValue.includes(".") || number !== ".") {
        setDisplayValue(displayValue + number);
      }
    }
  };
  const handleOperatorPress = (op) => {
    setOpPress(true);
    if (!caculating) {
      setCaculating(true);
      if (preValue !== "" && displayValue !== "" && operator !== "") {
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
        setDisplayValue(result.toString());
      } else if (preValue !== "") {
        setDisplayValue("");
      } else {
        setPreValue(displayValue);
      }
      setOperator(op);
    }
  };
  //尾數檢查
  const formatDisplayValue = (value) => {
    const floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
      const roundedValue = floatValue.toFixed(2);
      if (roundedValue.endsWith("0")) {
        return roundedValue.slice(0, -3);
      } else {
        return roundedValue;
      }
    }
    return value;
  };
  const handleEqualPress = () => {
    if (preValue !== "" && displayValue !== "" && operator !== "") {
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
      setDisplayValue(formatDisplayValue(result).toString());
      setPreValue("");
      setOperator("=");
    }
    setOpPress(false);
    setCaculating(false);
  };
  const handleClearPress = () => {
    setDisplayValue("");
    setPreValue("");
    setOperator("");
    setCaculating(false);
  };
  const handleDeletePress = () => {
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue("0");
    }
  };

  const [inValid, setInValid] = useState({
    amount: null,
    category: null,
    account: null,
  });

  //儲存按鈕
  const handleSavePress = async () => {
    //沒輸入的欄位變成紅色並彈出Toast
    if (amount === "" || category === "" || account === "" || icon === "") {
      setInValid({
        amount: !!amount,
        category: !!category,
        account: !!account,
      });

      if (!!amount === false && !!category === false) {
        setToastText("請輸入金額&類別&帳戶");
      } else if (
        !!amount === false &&
        !!category !== false &&
        !!account === false
      ) {
        setToastText("請輸入金額&帳戶");
      } else if (
        !!amount !== false &&
        !!category === false &&
        !!account === false
      ) {
        setToastText("請選擇類別&帳戶");
      } else if (
        !!amount !== false &&
        !!category === false &&
        !!account !== false
      ) {
        setToastText("請選擇類別");
      } else {
        setToastText("請選擇帳戶");
      }

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 1000);

      return;
    }

    console.log(date, amount, description, type, category, account, icon);
    await insertExpense(
      date,
      amount,
      description,
      type,
      category,
      account,
      icon
    )
      .then(() => {
        console.log("插入資料成功");
        navigation.goBack();
      })
      .catch((err) => {
        console.log("插入失敗", err);
      });
  };

  const handleFeedbackPress = () => {
    setIsAccountDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <>
      {showToast && <Toast width={250}>{toastText}</Toast>}

      <Pressable onPress={handleFeedbackPress} style={{ flex: 1 }}>
        <View
          style={[
            styles.formContainer,
            // screenType == "income"
            //   ? { backgroundColor: "rgba(58,197,105,0.5)" }
            //   : { backgroundColor: "rgba(255,119,97,0.5)" },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.amountContainer,
              pressed && styles.pressed,
              inValid.amount == false && { backgroundColor: "#f7aa97" },
            ]}
            onPress={handleAmountPress}
          >
            <AdjustText
              initFontSize={40}
              numberOfLines={1}
              screenType={screenType}
              inValid={inValid.amount}
            >
              ${" "}
              {displayValue
                ? displayValue === "."
                  ? setDisplayValue("0.")
                  : displayValue
                : "0"}
            </AdjustText>
          </Pressable>

          <View style={styles.listContainer}>
            <CategoryDropdown
              setCategory={setCategory}
              setIcon={setIcon}
              isCategoryDropdownOpen={isCategoryDropdownOpen}
              setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
              setIsAccountDropdownOpen={setIsAccountDropdownOpen}
              isAccountDropdownOpen={isAccountDropdownOpen}
              showKeyboard={showKeyboard}
              setShowKeyboard={setShowKeyboard}
              screenType={screenType}
              inValid={inValid.category}
            />
          </View>
          {!isCategoryDropdownOpen && (
            <>
              <View style={styles.listContainer}>
                <AccountDropdown
                  setAccount={setAccount}
                  isAccountDropdownOpen={isAccountDropdownOpen}
                  setIsAccountDropdownOpen={setIsAccountDropdownOpen}
                  setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
                  isCategoryDropdownOpen={isCategoryDropdownOpen}
                  showKeyboard={showKeyboard}
                  setShowKeyboard={setShowKeyboard}
                  screenType={screenType}
                  inValid={inValid.account}
                  account={account}
                />
              </View>

              {!isAccountDropdownOpen && (
                <View style={styles.listContainer}>
                  <CustomTextInput
                    setDescription={setDescription}
                    textInputValue={textInputValue}
                    setTextInputValue={textInputValue}
                    handleTextChange={handleTextChange}
                  />
                </View>
              )}
            </>
          )}
          {!showKeyboard && (
            <TouchableOpacity
              onPress={handleSavePress}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>儲存</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* 鍵盤 */}
        {showKeyboard && (
          <View style={{ height: "55%", backgroundColor: Colors.primary100 }}>
            <View style={styles.keyboardContainer}>
              <View style={styles.col}>
                <Pressable
                  onPress={() => handleNumberPress("1")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>1</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress("4")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>4</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress("7")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>7</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress(".")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>.</Text>
                </Pressable>
              </View>
              <View style={styles.col}>
                <Pressable
                  onPress={() => handleNumberPress("2")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>2</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress("5")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>5</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress("8")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>8</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress("0")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>0</Text>
                </Pressable>
              </View>
              <View style={styles.col}>
                <Pressable
                  onPress={() => handleNumberPress("3")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>3</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress("6")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>6</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNumberPress("9")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.text}>9</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDeletePress("delete")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
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
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.text, { color: Colors.sucess }]}>+</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleOperatorPress("mul")}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.text, { color: "#30a9de" }]}>×</Text>
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
                    opPress ? handleEqualPress : () => setShowKeyboard(false)
                  }
                  style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: Colors.sucess },
                    pressed && styles.pressed,
                    ,
                    opPress && { backgroundColor: "#30a9de" },
                  ]}
                >
                  <Text style={[styles.text, { color: "white" }]}>
                    {opPress ? "=" : "完成"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </Pressable>
    </>
  );
};

export default Form;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: Colors.primary100,
    alignItems: "center",
  },
  amountContainer: {
    backgroundColor: "white",
    width: 325,
    height: 100,
    marginTop: 10,
    borderRadius: 16,
    paddingHorizontal: 20,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
    justifyContent: "center",
  },
  amountText: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.gray100,
  },
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
    height: 88,
    width: 83,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  text: {
    fontSize: 28,
    fontWeight: "500",
    color: Colors.gray100,
  },
  col: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  pressed: {
    opacity: 0.8,
  },
  listContainer: {
    marginTop: 30,
  },
  saveButton: {
    position: "absolute",
    top: "65%",
    backgroundColor: Colors.gray100,
    borderRadius: 5,
    width: 325,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    bottom: "30%",
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  inValid: "#f7aa97",
});
