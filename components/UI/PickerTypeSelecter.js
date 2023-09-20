import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { getFormattedDate } from "../../util/date";

const PickerTypeSelecter = ({
  setShow,
  setPickType,
  setShowDatePicker,
  startDay,
  endDay,
  setCustomPress,
}) => {
  const handleCancelPress = () => {
    setCustomPress(false);
    setShow(false);
  };

  const handleConfirmPress = () => {
    setShow(false);
  };

  const handleStartDatePress = () => {
    setPickType("start");
    setShowDatePicker(true);
  };

  const handleEndDatePress = () => {
    setPickType("end");
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: Colors.gray100 }}>
        選擇日期範圍
      </Text>
      <View style={{ borderWidth: 1, width: "100%", opacity: 0.1 }}></View>
      <Text style={styles.text}>起始日：</Text>
      <TouchableOpacity
        onPress={handleStartDatePress}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>
          {getFormattedDate(startDay).toString()}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.text, { marginTop: 20 }]}>結束日：</Text>
      <TouchableOpacity onPress={handleEndDatePress} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {getFormattedDate(endDay).toString()}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={handleCancelPress}
          style={[styles.button, { backgroundColor: Colors.error }]}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            取消
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirmPress} style={styles.button}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            確認
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PickerTypeSelecter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 350,
    width: 325,
    borderRadius: 16,
    alignItems: "center",
    padding: 20,
    justifyContent: "space-between",
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.gray100,
  },
  dateButton: {
    backgroundColor: Colors.primary200,
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 24,
    color: Colors.gray100,
  },
  button: {
    backgroundColor: Colors.sucess,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 12,
  },
});
