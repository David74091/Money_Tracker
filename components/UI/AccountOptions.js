import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { fetchAllAccounts } from "../../database/database";

const AccountOptions = ({
  handleOptionPress,
  inAccount,
  outAccount,
  optionType,
}) => {
  const [accounts, setAccounts] = useState();

  useEffect(() => {
    fetchAllAccounts()
      .then((data) => {
        if (!!!optionType) {
          // 在 data 数组的开头添加一个空对象
          const accountsWithEmpty = [
            { balance: 0, id: 99, name: "所有帳戶" },
          ].concat(data);
          setAccounts(accountsWithEmpty);
        } else {
          const filteredAccounts = data.filter((account) => {
            // 剔除名称包含在 inAccount 或 outAccount 中的账户
            return !(
              account.name.includes(inAccount) ||
              account.name.includes(outAccount)
            );
          });
          setAccounts(filteredAccounts);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>請選擇帳戶</Text>
      <View
        style={{
          borderWidth: 1,
          width: "100%",
        }}
      />
      <View style={{ height: 320 }}>
        <FlatList
          data={accounts}
          keyExtractor={(account, index) => index.toString()} // 使用索引作为 key
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOptionPress(item.name)}
              style={styles.option}
            >
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

export default AccountOptions;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray100,
    marginBottom: 10,
  },
  container: {
    backgroundColor: "white",
    height: 400,
    width: 325,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  option: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 270,
    backgroundColor: "#e3dede",
  },
  optionText: {
    fontWeight: "bold",
    color: Colors.gray100,
    fontSize: 18,
  },
  separator: {
    borderWidth: 1,
    opacity: 0.2,
  },
});
