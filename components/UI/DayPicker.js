import {
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useContext } from "react";
import { Colors } from "../../constants/Colors";
import Icon from "./Icon";

const DayPicker = ({
  isAccountDropdownOpen,
  setIsAccountDropdownOpen,
  selectedOption,
  setSelectedOption,
  setShowKeyboard,
  isValid,
}) => {
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 28; i++) {
      dates.push({ id: i.toString(), day: i });
    }
    return dates;
  };

  const data = generateDates();

  const toggleDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
    setShowKeyboard(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    toggleDropdown();
  };

  return (
    <>
      <Pressable
        onPress={toggleDropdown}
        style={({ pressed }) => [
          styles.budgeTypeContainer,
          isAccountDropdownOpen && styles.dropdownOpen,
          !isAccountDropdownOpen && styles.shadow,
          pressed && pressed && styles.pressed,
          isValid && { backgroundColor: "#f7aa97" },
        ]}
      >
        <View>
          <Text style={styles.title}>重置日期</Text>
          <Text style={styles.text}>
            {selectedOption ? `每月 ${selectedOption.day} 號重置` : "選擇週期"}
          </Text>
        </View>
        <View>
          {isAccountDropdownOpen ? (
            <Icon
              type="MaterialIcons"
              name="arrow-drop-up"
              size={36}
              color={Colors.gray100}
            />
          ) : (
            <Icon
              type="MaterialIcons"
              name="arrow-drop-down"
              size={36}
              color={Colors.gray100}
            />
          )}
        </View>
      </Pressable>
      {isAccountDropdownOpen && (
        <View style={styles.optionsContainer}>
          {
            <FlatList
              showsHorizontalScrollIndicator={false} // 去除水平滚动条
              data={data}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleOptionSelect(item)}
                  style={styles.optionItem}
                >
                  <Text style={styles.optionText}>{item.day}</Text>
                </TouchableOpacity>
              )}
            />
          }
        </View>
      )}
    </>
  );
};

export default DayPicker;

const styles = StyleSheet.create({
  budgeTypeContainer: {
    position: "relative",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    height: 70,
    width: 325,
    shadowColor: Colors.gray100,
    alignItems: "center",
    paddingHorizontal: 22,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray100,
  },
  optionsContainer: {
    position: "absolute",
    top: 70,
    width: "100%",
    height: 100,
    width: 325,
    backgroundColor: "#fff1b9",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#a79c81",
    borderBottomWidth: 0.2,
    marginLeft: 5,
    backgroundColor: Colors.primary200,
    borderRadius: 6,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  optionText: {
    fontSize: 20,

    color: Colors.gray100,
    fontWeight: "500",
    fontWeight: "bold",
  },
  shadow: { shadowRadius: 4, shadowOffset: { height: 3 }, shadowOpacity: 0.4 },
  dropdownOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    fontWeight: "bold",
    color: Colors.gray100,
    marginLeft: 2,
    opacity: 0.4,
    marginBottom: 5,
  },
});
