import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../../constants/Colors";
import { DateContext } from "../../store/date-context";
import { taiwanMidnight } from "../../util/date";

const DatePicker = ({
  setShow,
  setSelectedDate,
  selectedDate,
  expenseData,
  setFormDate,
  pickType,
  setStartDay,
  setEndDay,
  setShowDatePicker,
  startDay,
  endDay,
}) => {
  const { setScreenDate } = useContext(DateContext);
  const [date, setDate] = useState(
    !!expenseData
      ? new Date(expenseData.date)
      : !!pickType
      ? pickType == "start"
        ? startDay
        : endDay
      : new Date()
  );
  const toggleDatepicker = () => {
    setShow(!show);
  };

  console.log("datePicker", selectedDate);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;

      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
      }
    } else {
      toggleDatepicker();
    }
  };

  const handleCancelPress = () => {
    setShowDatePicker && setShowDatePicker(false);
    setShow(false);
  };

  const handleConfirmPress = () => {
    //處理起始與結束日
    if (!!pickType) {
      switch (pickType) {
        case "start":
          setStartDay(new Date(taiwanMidnight(date)));
          break;
        case "end":
          setEndDay(new Date(taiwanMidnight(date)));
      }
      setShowDatePicker(false);

      return;
    }

    if (expenseData == undefined) {
      setScreenDate(taiwanMidnight(date));
    }
    if (!!expenseData) {
      setFormDate(taiwanMidnight(date).toString());
    }
    setSelectedDate(taiwanMidnight(date));

    setShow(false);
  };

  return (
    <View style={styles.datePickerContainer}>
      <DateTimePicker
        testID=""
        value={date}
        mode={"date"}
        onChange={handleDateChange}
        display="spinner"
        locale="zh-tw"
        textColor="black"
        minimumDate={pickType == "end" ? startDay : new Date("2021-1-1")}
        maximumDate={pickType == "start" ? endDay : new Date("2030-1-1")}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={handleCancelPress}
          style={[styles.button, { backgroundColor: Colors.error }]}
        >
          <Text style={styles.text}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleConfirmPress}
          style={[styles.button, { backgroundColor: Colors.sucess }]}
        >
          <Text style={styles.text}>確認</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  datePickerContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "40%",
    borderRadius: 16,
    paddingVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  button: {
    height: 45,
    width: 125,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});
