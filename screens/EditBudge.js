import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../constants/Colors";
import Icon from "../components/UI/Icon";
import BudgeTypeDropdown from "../components/UI/DropDown/BudgeTypeDropDown";
import BudgeDatePicker from "../components/UI/BudgeDatePicke";
import { AmountButton, AmountKeyboard } from "../components/UI/BudgeKeyBoard";
import { BudgeContext } from "../store/budge-context";
import {
  createBudge,
  createOrUpdateBudge,
  fetchBudge,
} from "../database/database";
import {
  addDaysToDate,
  addOneMonthToDate,
  addOneYearToDate,
  taiwanMidnight,
  updateDayAndAddMonth,
  updateDayInDate,
} from "../util/date";
import ResetSwitch from "../components/UI/ResetSwitch";
import DayPicker from "../components/UI/DayPicker";
import Toast from "../components/UI/Toast";

const EditBudge = ({ navigation }) => {
  const [displayValue, setDisplayValue] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isReset, setIsReset] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchBudge().then((data) => {
      if (data) {
        setDisplayValue(data.amount.toString());
        setSelectedOption({ day: new Date(data.endDate).getDate().toString() });
        setSelectedDate(new Date(data.beginDate));
        setIsReset(!!data.reset);
      }
    });
  }, [navigation]);

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
      title: "編輯預算",
    });

    // 更新 AmountButton 的显示值
  }, [navigation, displayValue]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNumberPress = (number) => {
    setDisplayValue(displayValue + number);
  };

  const handleDeletePress = () => {
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue("");
    }
  };

  const handleClearPress = () => {
    setDisplayValue("");
  };

  const handleAmountPress = () => {
    setShowKeyboard(!showKeyboard);
    setIsAccountDropdownOpen(false);
  };

  const handleSavePress = () => {
    if (!selectedOption) {
      setIsValid(true);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 1000);

      return;
    }
    createOrUpdateBudge(
      parseFloat(displayValue), //amount
      "month", //type
      taiwanMidnight(selectedDate).toString(), //beginDate
      updateDayAndAddMonth(
        taiwanMidnight(new Date(selectedDate)), // 将日期字符串转换为日期对象
        selectedOption.day
      ).toString(),
      true,
      true,
      taiwanMidnight(selectedDate).toString()
    )
      .then(() => {
        console.log("創建budge成功");
        navigation.goBack();
      })
      .catch((error) => {
        console.log("創建budge失敗！！！", error);
      });
  };

  const handleFeedbackPress = () => {
    setIsAccountDropdownOpen(false);
    setShowKeyboard(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={handleFeedbackPress}
      style={styles.editBudgeContainer}
    >
      <View
        style={{
          backgroundColor: Colors.primary100,
          flex: 1,
          alignItems: "center",
          paddingTop: 30,
        }}
      >
        {showToast && <Toast width={150}>請選擇重置日期</Toast>}
        <View>
          <AmountButton
            handleAmountPress={handleAmountPress}
            displayValue={displayValue}
          />
        </View>

        <View style={styles.listContainer}>
          <BudgeDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setShowKeyboard={setShowKeyboard}
          />
        </View>

        <View style={styles.listContainer}>
          <DayPicker
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            isAccountDropdownOpen={isAccountDropdownOpen}
            setIsAccountDropdownOpen={setIsAccountDropdownOpen}
            setShowKeyboard={setShowKeyboard}
            isValid={isValid}
          />
        </View>

        {showKeyboard && (
          <View style={styles.keyboardContainer}>
            <AmountKeyboard
              handleNumberPress={handleNumberPress}
              handleDeletePress={handleDeletePress}
              handleClearPress={handleClearPress}
              setShowKeyboard={setShowKeyboard}
            />
          </View>
        )}
        <TouchableOpacity onPress={handleSavePress} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>儲存</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditBudge;

const styles = StyleSheet.create({
  editBudgeContainer: {
    position: "relative",
    backgroundColor: Colors.primary100,
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  listContainer: {
    marginTop: 30,
  },
  keyboardContainer: {
    height: "55%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 99,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    position: "absolute",
    bottom: 250,
    backgroundColor: Colors.gray100,
    borderRadius: 5,
    width: 325,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
});
