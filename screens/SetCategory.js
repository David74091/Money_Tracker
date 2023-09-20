import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import CategorySetting from "./CategorySetting";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";
import {
  getExpenseCategories,
  getIncomeCategories,
  updateExpenseCategories,
} from "../database/database";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SetCategory = ({ navigation }) => {
  const [screenType, setScreenType] = useState("expense");
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSavePress = () => {
    console.log("將要儲存的資料", data);
    // updateExpenseCategories(data)
    //   .then(() => {
    //     console.log("成功儲存");
    //     navigation.goBack();
    //   })
    //   .catch((err) => {
    //     console.log("儲存失敗", err);
    //   });
  };

  useEffect(() => {
    console.log("移動中喔", data);
  }, [data]);

  useLayoutEffect(() => {
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
      title: "類別順序",
    });
  }, [navigation]);

  useEffect(() => {
    if (screenType == "expense") {
      getExpenseCategories()
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.log("幹失敗了", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      getIncomeCategories()
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.log("幹失敗了", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [screenType]);

  const handleTypePress = (type) => {
    switch (type) {
      case "expense":
        setScreenType("expense");
        break;
      case "income":
        setScreenType("income");
        break;
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleTypePress("expense")}
          style={[
            styles.button,
            {
              backgroundColor: Colors.error,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
            },
            screenType == "expense" && { opacity: 0.2 },
          ]}
        >
          <Text style={styles.buttonText}>支出</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTypePress("income")}
          style={[
            styles.button,
            {
              backgroundColor: Colors.sucess,
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
            },
            screenType == "income" && { opacity: 0.2 },
          ]}
        >
          <Text style={styles.buttonText}>收入</Text>
        </TouchableOpacity>
      </View>
      <CategorySetting
        screenType={screenType}
        data={data}
        setData={setData}
        handleSavePress={handleSavePress}
      />
    </View>
  );
};

export default SetCategory;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.primary100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    height: 80,
    backgroundColor: "white",
    width: 162,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray100,
  },
});
