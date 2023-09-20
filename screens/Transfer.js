import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";
import AccountOptions from "../components/UI/AccountOptions";
import { AmountKeyboard } from "../components/UI/BudgeKeyBoard";
import { transferFunds } from "../database/database";

const Transfer = ({ navigation }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [optionType, setOptionType] = useState("");
  const [outAccount, setOutAccount] = useState();
  const [inAccount, setInAccount] = useState();
  const [showKeyBoard, setShowKeyBoard] = useState(false);
  const [displayBalance, setDisplayBalance] = useState("");

  const handleOptionPress = (option) => {
    if (optionType === "in") {
      setInAccount(option);
    } else {
      setOutAccount(option);
    }
    setShowOptions(false);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNumberPress = (number) => {
    if (number.startsWith(".")) {
      setDisplayBalance("0" + number);
    }
    setDisplayBalance(displayBalance + number);
  };

  const handleKeyboardDeletePress = () => {
    if (displayBalance.length > 1) {
      setDisplayBalance(displayBalance.slice(0, -1));
    } else {
      setDisplayBalance("");
    }
  };

  const handleClearPress = () => {
    setDisplayBalance("");
  };

  const handleConfirmPress = () => {
    const balanceToSet = displayBalance === "" ? 0 : parseFloat(displayBalance);

    transferFunds(outAccount, inAccount, balanceToSet)
      .then(() => {
        console.log("轉帳成功");
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
      });
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
      title: "轉帳",
    });
  }, [navigation]);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowKeyBoard(false);
      }}
    >
      <View style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          <Text style={styles.titlText}>轉帳金額</Text>

          <TouchableOpacity
            onPress={() => setShowKeyBoard(true)}
            style={styles.amount}
          >
            <Text style={styles.buttonText}>
              $ {displayBalance ? displayBalance : "0"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.titlText}>轉出帳號</Text>
          <TouchableOpacity
            onPress={() => {
              setShowKeyBoard(false);
              setShowOptions(true);
              setOptionType("out");
            }}
            style={styles.optionButton}
          >
            <Text style={styles.buttonText}>
              {" "}
              {outAccount ? outAccount : "選擇帳號"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.titlText}>轉出帳號</Text>
          <TouchableOpacity
            onPress={() => {
              setShowOptions(true);
              setOptionType("in");
            }}
            style={styles.optionButton}
          >
            <Text style={styles.buttonText}>
              {inAccount ? inAccount : "選擇帳號"}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={[styles.buttons, { backgroundColor: Colors.error }]}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                取消
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirmPress}
              style={[styles.buttons, { backgroundColor: Colors.sucess }]}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                確認
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal animationType="fade" transparent={true} visible={showOptions}>
          <View style={styles.modalContainer}>
            <AccountOptions
              handleOptionPress={handleOptionPress}
              inAccount={inAccount}
              outAccount={outAccount}
              optionType={optionType}
            />
          </View>
        </Modal>
        {showKeyBoard && (
          <View style={styles.keyboardContainer}>
            <AmountKeyboard
              handleNumberPress={handleNumberPress}
              handleDeletePress={handleKeyboardDeletePress}
              handleClearPress={handleClearPress}
              setShowKeyboard={setShowKeyBoard}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Transfer;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.primary100,
    flex: 1,
    alignItems: "center",
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(39,69,85,0.5)",
    flex: 1,
  },
  cardContainer: {
    marginTop: 30,
    backgroundColor: "white",
    width: 325,
    height: 500,
    borderRadius: 16,
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  titlText: { fontWeight: "bold", color: Colors.gray100, fontSize: 24 },
  optionButton: {
    backgroundColor: Colors.primary200,
    width: 200,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  buttonText: {
    fontWeight: "bold",
    color: Colors.gray100,
    fontSize: 16,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  buttons: {
    backgroundColor: Colors.sucess,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 12,
  },
  amount: {
    marginBottom: 25,
    height: 50,
    width: 200,
    backgroundColor: "#fff1b9",
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  keyboardContainer: {
    height: "55%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 99,
  },
});
