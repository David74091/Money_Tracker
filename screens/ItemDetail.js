import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { deleteExpenseById, fetchExpenseById } from "../database/database";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/Colors";
import Icon from "../components/UI/Icon";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { getFormattedDate } from "../util/date";

const ItemDetail = ({ route }) => {
  const id = route.params.id;
  const [expenseData, setExpenseData] = useState();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (expenseData) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={handleBackPress}>
            <Icon
              type="AntDesign"
              name="arrowleft"
              size={24}
              color={Colors.gray100}
            />
          </TouchableOpacity>
        ),
        headerTitleStyle: { color: Colors.gray100 },
        headerStyle: { backgroundColor: Colors.primary100 },
        headerShadowVisible: false,
        title:
          expenseData && expenseData.type === "income"
            ? "收入詳情"
            : "支出詳情",
      });
    }
  }, [navigation, expenseData]);

  useEffect(() => {
    setIsLoading(true);
    fetchExpenseById(id)
      .then((data) => {
        console.log("data", data);
        setExpenseData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [route]);

  const handleDeletePress = () => {
    deleteExpenseById(expenseData.id)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditPress = () => {
    navigation.navigate("EditExpense", { id: expenseData.id });
  };

  if (isLoading || !expenseData) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailContainer}>
        <View style={styles.amountContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              type={expenseData && expenseData.icon.type}
              name={expenseData && expenseData.icon.name}
              size={28}
              color={Colors.gray100}
            />
            <Text style={styles.amountTitle}>
              {expenseData && expenseData.category}
            </Text>
          </View>
          <Text
            style={[
              { fontSize: 28, fontWeight: "bold", color: Colors.gray100 },
              expenseData && expenseData.type == "income"
                ? { color: Colors.sucess }
                : { color: Colors.error },
            ]}
          >
            {expenseData && expenseData.type == "income" ? "+" : "-"}$
            {expenseData && expenseData.amount}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>日期</Text>
          <Text style={styles.text}>
            {expenseData && getFormattedDate(new Date(expenseData.date))}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>帳戶</Text>
          <Text style={styles.text}>{expenseData && expenseData.account}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>交易類型</Text>
          <Text style={styles.text}>
            {expenseData && expenseData.type == "income" ? "收入" : "支出"}
          </Text>
        </View>
        <View
          style={[
            styles.itemContainer,
            { borderBottomWidth: 0, marginBottom: 15, maxHeight: 200 },
          ]}
        >
          <Text style={styles.title}>備註</Text>
          <ScrollView>
            <Text style={styles.text}>
              {expenseData && expenseData.description}
            </Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={handleDeletePress}
          style={[styles.button, { backgroundColor: Colors.error }]}
        >
          <Text style={styles.buttonText}>刪除</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleEditPress}
          style={[styles.button, { backgroundColor: Colors.gray100 }]}
        >
          <Text style={styles.buttonText}>編輯</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemDetail;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.primary100,
    flex: 1,
    alignItems: "center",
  },
  detailContainer: {
    marginTop: "10%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    maxHeight: 600,
    width: 320,
    justifyContent: "space-around",
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  amountContainer: {
    flexDirection: "row",
    borderBottomWidth: 0.2,
    borderBottomColor: "#a79c81",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  amountTitle: {
    fontWeight: "bold",
    color: Colors.gray100,
    fontSize: 28,
    marginLeft: 10,
  },

  text: {
    fontSize: 20,
    color: Colors.gray100,
    fontWeight: "bold",
    marginTop: 5,
  },
  itemContainer: {
    borderBottomWidth: 0.2,
    borderBottomColor: "#a79c81",
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    color: Colors.gray100,
    opacity: 0.4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginTop: 50,
  },
  button: {
    height: 45,
    width: 125,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
});
