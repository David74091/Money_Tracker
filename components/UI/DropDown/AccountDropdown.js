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
import { fetchAllAccounts } from "../../../database/database";
import LoadingOverlay from "../LoadingOverlay";

const AccountDropdown = ({
  isAccountDropdownOpen,
  setIsAccountDropdownOpen,
  setShowKeyboard,
  setIsCategoryDropdownOpen,
  setAccount,
  inValid,
  screenType,
  expenseData,
  account,
}) => {
  const [accounts, setAccounts] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllAccounts()
      .then((accountsData) => {
        console.log("抓取帳戶成功");
        setAccounts(accountsData);
      })
      .catch((error) => {
        console.log("抓取帳戶失敗");
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(accounts);
  }, [accounts]);

  const [selectedOption, setSelectedOption] = useState(
    expenseData && expenseData.account
  );

  const toggleDropdown = () => {
    console.log("按下下拉");
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
    setShowKeyboard(false);
    setIsCategoryDropdownOpen(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option.name);
    setAccount(option.name);

    toggleDropdown();
  };

  useEffect(() => {
    console.log("帳戶", expenseData);
  }, [expenseData]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleDropdown}
        style={({ pressed }) => [
          styles.dropdownButton,
          pressed && styles.pressed,
          isAccountDropdownOpen && styles.dropdownOpen,
          !isAccountDropdownOpen && styles.shadow,
          inValid == false && styles.inValid,
        ]}
      >
        <View>
          <Text style={styles.title}>
            {screenType == "income" ? "收入" : "支出"}帳戶
          </Text>
          <Text style={styles.dropdownButtonText}>
            {selectedOption ? selectedOption : "選擇帳戶"}
          </Text>
        </View>
        <View style={styles.arrow}>
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
          <FlatList
            data={accounts}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleOptionSelect(item)}
                style={styles.optionItem}
              >
                <Text style={styles.optionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
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
    height: 170,
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
});

export default AccountDropdown;
