import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { Colors } from "../constants/Colors";
import Icon from "../components/UI/Icon";
import { BudgeCardSwitch, EditBudgeCard } from "../components";

const Budge = ({ navigation }) => {
  const handleBackPress = () => {
    navigation.navigate("Home", { id: 123 });
  };

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
      title: "預算列表",
    });
  }, [navigation]);

  return (
    <View style={styles.budgeContainer}>
      <View>
        <EditBudgeCard />
      </View>
      <View style={styles.switchContainer}>
        <BudgeCardSwitch />
      </View>
    </View>
  );
};

export default Budge;

const styles = StyleSheet.create({
  budgeContainer: {
    paddingTop: 50,
    backgroundColor: Colors.primary100,
    flex: 1,
    alignItems: "center",
  },
  switchContainer: {
    marginTop: 30,
  },
});
