import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import Icon from "../Icon";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "../../../database/database";

const CategoryDropdown = ({
  isCategoryDropdownOpen,
  setShowKeyboard,
  setIsCategoryDropdownOpen,
  setIsAccountDropdownOpen,
  setCategory,
  setIcon,
  inValid,
  screenType,
  expenseData,
}) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    expenseData && {
      type: expenseData.icon.type,
      icon: expenseData.icon.name,
      label: expenseData.category,
      value: expenseData.category,
    }
  );

  const toggleDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setShowKeyboard(false);
    setIsAccountDropdownOpen(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setCategory(option.value);
    setIcon({ type: option.type, name: option.icon });
    toggleDropdown();
  };

  useEffect(() => {
    if (screenType == "expense") {
      getExpenseCategories()
        .then((data) => {
          setOptions(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      getIncomeCategories()
        .then((data) => {
          setOptions(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleDropdown}
        style={({ pressed }) => [
          styles.dropdownButton,
          pressed && styles.pressed,
          isCategoryDropdownOpen && styles.dropdownOpen,
          !isCategoryDropdownOpen && styles.shadow,
          inValid == false && styles.inValid,
        ]}
      >
        <Text style={styles.title}>
          {screenType == "income" ? "收入" : "支出"}類別
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.optionButtonTextContainer}>
            {selectedOption && (
              <Icon
                type={selectedOption.type}
                name={selectedOption.icon}
                size={28}
                color={Colors.gray100}
              />
            )}

            <Text
              style={[
                styles.dropdownButtonText,
                selectedOption && { marginLeft: 5 },
              ]}
            >
              {selectedOption ? selectedOption.label : "選擇類別"}
            </Text>
          </View>
        </View>
        <View style={styles.arrow}>
          {isCategoryDropdownOpen ? (
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
      {isCategoryDropdownOpen && (
        <FlatList
          data={options}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleOptionSelect(item)}
              style={styles.optionItem}
            >
              <Icon
                type={item.type}
                name={item.icon}
                size={24}
                color={Colors.gray100}
              />
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.value.toString()}
          style={styles.optionsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "col",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "white",
    width: 325,
    height: 70,
    paddingHorizontal: 10,
  },
  shadow: { shadowRadius: 4, shadowOffset: { height: 3 }, shadowOpacity: 0.4 },
  dropdownButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray100,
    marginTop: 2,
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
    height: 250,
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
    top: 18,
  },
  optionButtonTextContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  inValid: {
    backgroundColor: "#f7aa97",
  },
});

export default CategoryDropdown;
