import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { Colors } from "../../constants/Colors";
import DatePicker from "./DatePicker";
import { getFormattedDate } from "../../util/date";

const BudgeDatePicker = ({
  selectedDate,
  setSelectedDate,
  setShowKeyboard,
}) => {
  const [show, setShow] = useState(false);

  const handleDatePress = () => {
    setShow(true);
    setShowKeyboard(false);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleDatePress} style={styles.dropdownButton}>
        <View>
          <Text style={styles.title}>預算開始日</Text>
          <Text style={styles.dropdownButtonText}>
            {getFormattedDate(selectedDate)}
          </Text>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "white",
    width: 325,
    height: 70,
    paddingHorizontal: 10,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  shadow: { shadowRadius: 4, shadowOffset: { height: 3 }, shadowOpacity: 0.4 },
  dropdownButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray100,
    marginLeft: 11,
  },
  title: {
    fontWeight: "bold",
    color: Colors.gray100,
    marginLeft: 12,
    opacity: 0.4,
    marginBottom: 5,
  },
  optionsContainer: {
    position: "absolute",
    top: 70,
    width: "100%",
    height: 150,
    backgroundColor: "#fff1b9",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#a79c81",
    borderBottomWidth: 0.2,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.gray100,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.9,
  },
  dropdownOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  arrow: {
    position: "absolute",
    right: 20,
  },
  inValid: {
    backgroundColor: "#f7aa97",
  },
  modalContainer: {
    backgroundColor: "rgba(39,69,85,0.7)",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default BudgeDatePicker;
