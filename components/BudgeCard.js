import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { convertISODateToSQLiteFormat } from "../util/date";

const BudgeCard = ({ remain, budge, progress }) => {
  const [refreshKey, setRefreshKey] = useState(false); // 可变的值用于触发刷新

  const navigation = useNavigation();

  // 函数用于手动触发刷新

  const handleBudgePress = () => {
    navigation.navigate("Budge");
    setRefreshKey(!refreshKey);
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Pressable
        onPress={handleBudgePress}
        style={({ pressed }) => [
          styles.mainContainer,
          pressed && styles.pressed,
        ]}
      >
        {remain != null ? (
          <>
            <View style={styles.leftContainer}>
              <Text style={styles.text}>$ {remain != null && remain}</Text>
              <Text style={styles.label}>剩餘預算</Text>
            </View>
            <Text style={styles.division}>/</Text>
            <View style={styles.rightContainer}>
              <Text style={styles.text}>
                $ {budge && budge.amount.toString()}
              </Text>
              <Text style={styles.label}>預算總額</Text>
            </View>
          </>
        ) : (
          <View>
            <Text style={styles.text}>點擊新增預算</Text>
          </View>
        )}
      </Pressable>
      {remain != null && (
        <View style={styles.progressContainer}>
          <View style={[styles.progress, { width: progress }]}></View>
        </View>
      )}
    </View>
  );
};

export default BudgeCard;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    backgroundColor: Colors.primary200,
    width: "100%",
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  leftContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray100,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.gray100,
  },
  division: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 24,
    marginHorizontal: 6,
    color: Colors.gray100,
  },
  progressContainer: {
    backgroundColor: "#e49821",
    width: "100%",
    height: 5,
  },
  progress: {
    height: 5,

    backgroundColor: Colors.gray100,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
