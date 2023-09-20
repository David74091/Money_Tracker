import { StyleSheet, Text, View } from "react-native";
import {
  Ionicons,
  Feather,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import React from "react";

const Icon = ({ type, name, size, color }) => {
  let IconComponent;

  switch (type) {
    case "Ionicons":
      IconComponent = Ionicons;
      break;
    case "Feather":
      IconComponent = Feather;
      break;
    case "AntDesign":
      IconComponent = AntDesign;
      break;
    case "MaterialIcons":
      IconComponent = MaterialIcons;
      break;
    case "MaterialCommunityIcons":
      IconComponent = MaterialCommunityIcons;
      break;
    case "FontAwesome":
      IconComponent = FontAwesome;
      break;
    case "FontAwesome5":
      IconComponent = FontAwesome5;
      break;
    default:
      break;
  }

  return (
    <View style={styles.icon}>
      <IconComponent name={name} size={size} color={color} />
    </View>
  );
};

export default Icon;

const styles = StyleSheet.create({
  iconContainer: {
    width: 20,
    height: 20,
  },
});
