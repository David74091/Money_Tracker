import {
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { Colors } from "../../../constants/Colors";
import Icon from "../Icon";

const BudgeTypeDropdown = ({
  isAccountDropdownOpen,
  setIsAccountDropdownOpen,
  selectedOption,
  setSelectedOption,
  setShowKeyboard,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const toggleDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
    setShowKeyboard(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    toggleDropdown();
  };

  const accounts = [
    { id: 1, name: "一個月", value: "month" },
    { id: 2, name: "一年", value: "year" },
  ];

  return (
    <>
      <Pressable
        onPress={toggleDropdown}
        style={({ pressed }) => [
          styles.budgeTypeContainer,
          isAccountDropdownOpen && styles.dropdownOpen,
          !isAccountDropdownOpen && styles.shadow,
          pressed && pressed && styles.pressed,
        ]}
      >
        <View>
          <Text style={styles.title}>預算週期</Text>
          <Text style={styles.text}>
            {selectedOption ? selectedOption.name : "選擇週期"}
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
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              onPress={() => handleOptionSelect(account)}
              style={styles.optionItem}
            >
              <Text style={styles.optionText}>{account.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

export default BudgeTypeDropdown;

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
    fontSize: 18,
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
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.gray100,
    fontWeight: "500",
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
