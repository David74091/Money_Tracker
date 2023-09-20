import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import Icon from "../../components/UI/Icon";
import { Colors } from "../../constants/Colors";

const AmountButton = ({ displayValue, handleAmountPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.amountButton, pressed && styles.pressed]}
      onPress={handleAmountPress}
    >
      <Text style={styles.amountButtonText}>
        $ {displayValue ? displayValue : "0"}
      </Text>
    </Pressable>
  );
};

const AmountKeyboard = ({
  handleNumberPress,
  handleDeletePress,
  handleClearPress,
  setShowKeyboard,
}) => {
  return (
    <View style={styles.keyboardContainer}>
      <View style={styles.col}>
        <Pressable
          onPress={() => handleNumberPress("1")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>1</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress("4")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>4</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress("7")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>7</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress(".")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>.</Text>
        </Pressable>
      </View>
      <View style={styles.col}>
        <Pressable
          onPress={() => handleNumberPress("2")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>2</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress("5")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>5</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress("8")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>8</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress("0")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>0</Text>
        </Pressable>
      </View>
      <View style={styles.col}>
        <Pressable
          onPress={() => handleNumberPress("3")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>3</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress("6")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>6</Text>
        </Pressable>
        <Pressable
          onPress={() => handleNumberPress("9")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>9</Text>
        </Pressable>
        <Pressable
          onPress={() => handleDeletePress("delete")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.text}>
            <Icon
              type="Feather"
              name="delete"
              size={36}
              color={Colors.gray100}
            />
          </Text>
        </Pressable>
      </View>
      <View style={styles.functionCol}>
        <Pressable
          onPress={handleClearPress}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: Colors.error, flex: 1 },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.text, { color: "white" }]}>AC</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowKeyboard(false)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: Colors.sucess, flex: 1, marginTop: 5 },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.text, { color: "white" }]}>完成</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  amountButton: {
    backgroundColor: "white",
    width: 325,
    height: 100,
    marginTop: 10,
    borderRadius: 16,
    paddingHorizontal: 20,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
    justifyContent: "center",
  },
  amountButtonText: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.gray100,
  },
  keyboardContainer: {
    width: "100%",
    height: "100%",
    padding: 10,
    backgroundColor: Colors.primary200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  button: {
    height: 85,
    width: 85,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  text: {
    fontSize: 28,
    fontWeight: "500",
    color: Colors.gray100,
  },
  pressed: {
    opacity: 0.8,
  },
  col: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  functionCol: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});

export { AmountButton, AmountKeyboard };
