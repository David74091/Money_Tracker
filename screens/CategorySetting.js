import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  useOnCellActiveAnimation,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  getExpenseCategories,
  updateExpenseCategories,
  updateIncomeCategories,
} from "../database/database";
import LoadingOverlay from "../components/UI/LoadingOverlay";

const CategorySetting = ({ data, setData, screenType }) => {
  const ref = useRef(null);

  const renderItem = ({ item, drag }) => {
    const { isActive } = useOnCellActiveAnimation();
    return (
      <ScaleDecorator>
        <OpacityDecorator>
          <ShadowDecorator>
            <TouchableOpacity onLongPress={drag} style={styles.button}>
              <Animated.View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Icon
                  type={item.type}
                  name={item.icon}
                  size={28}
                  color={Colors.gray100}
                ></Icon>
                <Text style={styles.text}>{item.label}</Text>
                <Icon
                  type="Ionicons"
                  name="menu-outline"
                  size={28}
                  color={Colors.gray100}
                />
              </Animated.View>
            </TouchableOpacity>
          </ShadowDecorator>
        </OpacityDecorator>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DraggableFlatList
          showsVerticalScrollIndicator={false} // 隐藏垂直滚动条
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={ref}
          data={data}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => {
            setData(data);

            if (screenType == "expense") {
              updateExpenseCategories(data)
                .then(() => {
                  console.log("更新順序成功");
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              updateIncomeCategories(data)
                .then(() => {
                  console.log("更新順序成功");
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }}
          renderItem={renderItem}
          style={styles.flatList} // 在这里设置样式
        />
      </GestureHandlerRootView>
    </View>
  );
};

export default CategorySetting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary100,
    alignItems: "center",
    paddingTop: 30,
    flex: 1,
  },

  button: {
    paddingHorizontal: 20,
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 12,
    height: 50,
    width: 325,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 1 },
    shadowOpacity: 0.4,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray100,
  },
  flatList: {
    width: 350,
  },
});
