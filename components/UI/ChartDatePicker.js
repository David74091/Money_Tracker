import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constants/Colors";

const ChartDatePicker = ({
  handleDateButtonPress,
  setCustomPress,
  customPress,
}) => {
  const [yearPress, setYearPress] = useState(false);
  const [sixMonthsPress, setSixmonthsPress] = useState(false);
  const [weekPress, setWeekPress] = useState(false);
  const [monthPress, setMonthPress] = useState(false);

  const handleYearPress = () => {
    handleDateButtonPress("year");
    setCustomPress(false);
    setYearPress(true);
    setSixmonthsPress(false);
    setMonthPress(false);
    setWeekPress(false);
  };
  const handleSixMonthsPress = () => {
    handleDateButtonPress("sixMonths");
    setCustomPress(false);
    setSixmonthsPress(true);
    setYearPress(false);
    setMonthPress(false);
    setWeekPress(false);
  };
  const handleMonthPress = () => {
    handleDateButtonPress("month");
    setCustomPress(false);
    setMonthPress(true);
    setYearPress(false);
    setSixmonthsPress(false);
    setWeekPress(false);
  };
  const handleWeekPress = () => {
    handleDateButtonPress("week");
    setCustomPress(false);
    setWeekPress(true);
    setYearPress(false);
    setMonthPress(false);
    setSixmonthsPress(false);
  };
  const handleCustomPress = () => {
    handleDateButtonPress("custom");
    setCustomPress(true);
    setWeekPress(false);
    setYearPress(false);
    setMonthPress(false);
    setSixmonthsPress(false);
  };

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        onPress={handleCustomPress}
        style={[
          styles.button,
          { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
          customPress && { backgroundColor: "rgba(39,69,85,0.2)" },
        ]}
      >
        <Text style={styles.text}>自訂</Text>
      </TouchableOpacity>
      <View style={styles.div}></View>
      <TouchableOpacity
        onPress={handleYearPress}
        style={[
          styles.button,

          yearPress && { backgroundColor: "rgba(39,69,85,0.2)" },
        ]}
      >
        <Text style={styles.text}>一年</Text>
      </TouchableOpacity>
      <View style={styles.div}></View>
      <TouchableOpacity
        onPress={handleSixMonthsPress}
        style={[
          styles.button,
          sixMonthsPress && { backgroundColor: "rgba(39,69,85,0.2)" },
        ]}
      >
        <Text style={styles.text}>半年</Text>
      </TouchableOpacity>
      <View style={styles.div}></View>
      <TouchableOpacity
        onPress={handleMonthPress}
        style={[
          styles.button,
          monthPress && { backgroundColor: "rgba(39,69,85,0.2)" },
        ]}
      >
        <Text style={styles.text}>一個月</Text>
      </TouchableOpacity>
      <View style={styles.div}></View>
      <TouchableOpacity
        onPress={handleWeekPress}
        style={[
          styles.button,
          { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
          weekPress && { backgroundColor: "rgba(39,69,85,0.2)" },
        ]}
      >
        <Text style={styles.text}>一星期</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChartDatePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  button: {
    backgroundColor: "white",
    height: 70,
    width: 71,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.gray100,
  },
  div: {
    borderWidth: 1,
    height: "100%",
    borderColor: Colors.gray100,
    opacity: 0.1,
  },
});
