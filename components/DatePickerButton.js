//expo datePicker
//https://docs.expo.dev/versions/latest/sdk/date-time-picker/
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../constants/Colors";
import Icon from "./UI/Icon";
import DatePicker from "./UI/DatePicker";
import { getFormattedDate } from "../util/date";

const DatePickerButton = ({ selectedDate, setSelectedDate }) => {
  const [show, setShow] = useState(false);

  const handleDatePress = () => {
    setShow(true);
  };

  return (
    <>
      <Pressable
        onPress={handleDatePress}
        style={({ pressed }) => [
          styles.mainContainer,
          pressed && styles.pressed,
        ]}
      >
        <Icon type="Feather" name="calendar" size={30} color="white" />
        <Text style={styles.text}>{getFormattedDate(selectedDate)}</Text>
      </Pressable>

      <Modal animationType="fade" transparent={true} visible={show}>
        <View style={styles.modalContainer}>
          <DatePicker
            setShow={setShow}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        </View>
      </Modal>
    </>
  );
};

export default DatePickerButton;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    width: 238,
    height: 57,
    borderRadius: 100,
    alignSelf: "center",
    flexDirection: "row",
  },
  pressed: { opacity: 0.5 },
  text: {
    marginLeft: 12,
    fontSize: 24,
    color: "white",
    fontWeight: "500",
  },
  modalContainer: {
    backgroundColor: "rgba(39,69,85,0.7)",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
