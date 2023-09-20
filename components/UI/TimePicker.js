import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../../constants/Colors";
import { taiwanMidnight } from "../../util/date";

const TimePicker = ({ selectedTime, setSelectedTime, noteDate }) => {
  const [time, setTime] = useState(
    noteDate.length > 0 ? new Date(noteDate[0].time) : new Date()
  );

  const handleDateChange = (event, selectedTime) => {
    if (event.type === "set") {
      const currentDate = selectedTime || time;

      setSelectedTime(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
      }
    } else {
      toggleDatepicker();
    }
  };

  useEffect(() => {
    console.log("选中的时间", selectedTime);
  }, [selectedTime]);

  return (
    <View style={styles.datePickerContainer}>
      <DateTimePicker
        testID=""
        value={time}
        mode={"time"}
        onChange={handleDateChange}
        display="spinner"
        locale="zh-tw"
        textColor="black"
      />
    </View>
  );
};

export default TimePicker;

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
