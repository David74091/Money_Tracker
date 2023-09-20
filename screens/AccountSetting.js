import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";
import {
  addBalanceById,
  fetchAllAccounts,
  setBalanceById,
  updateAccounts,
} from "../database/database";
import DraggableFlatList, {
  ScaleDecorator,
  ShadowDecorator,
  OpacityDecorator,
  useOnCellActiveAnimation,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { useIsFocused } from "@react-navigation/native";
import { AmountKeyboard } from "../components/UI/BudgeKeyBoard";

const AccountSetting = ({
  accountsData,
  handleDeletePress,
  setFinishAdd,
  finishAdd,
  setAccountsData,
}) => {
  const [isBalancePress, setIsBalancePress] = useState(false);
  const [pressId, setPressId] = useState();
  const [balance, setBalance] = useState(0);
  const [displayBalance, setDisplayBalance] = useState("");
  const ref = useRef(null);

  //keyborad
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleBalancePress = (id, balance) => {
    setPressId(id);
    setIsBalancePress(true);
    setDisplayBalance(balance.toString());
  };

  const handleConfirmPress = () => {
    // 如果 displayBalance 为空字符串，设置为 0
    const balanceToSet = displayBalance === "" ? 0 : parseFloat(displayBalance);

    setBalanceById(pressId, balanceToSet)
      .then(() => {
        console.log("添加餘額成功");
        setFinishAdd(!finishAdd);
        setIsBalancePress(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setShowKeyboard(false);
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
                <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                  <Icon
                    type="Ionicons"
                    name="remove-circle"
                    size={28}
                    color={Colors.error}
                  />
                </TouchableOpacity>
                <Text style={styles.text}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => handleBalancePress(item.id, item.balance)}
                  style={{
                    backgroundColor: "#fff1b9",
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 70,
                    maxWidth: 100,
                    borderRadius: 6,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text style={{ color: Colors.gray100, fontWeight: "bold" }}>
                    $ {item.balance}
                  </Text>
                </TouchableOpacity>
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
          data={accountsData}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => {
            setAccountsData(data);
            // 在setState的回调函数中调用updateAccounts
            updateAccounts(data)
              .then(() => {
                console.log("儲存新順序成功");
              })
              .catch((err) => {
                console.log(err);
              });
          }}
          renderItem={renderItem}
          style={styles.flatList} // 在这里设置样式
        />
      </GestureHandlerRootView>

      <Modal animationType="fade" transparent={true} visible={isBalancePress}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowKeyboard(false);
          }}
        >
          <View
            style={[
              styles.modalContainer,
              showKeyboard && { justifyContent: "" },
            ]}
          >
            <View
              style={[
                styles.inputContanier,
                showKeyboard && { marginTop: 100 },
              ]}
            >
              <Text style={styles.title}>餘額</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowKeyboard(true);
                }}
                style={styles.input}
              >
                <Text
                  style={{
                    color: Colors.gray100,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  $ {displayBalance ? displayBalance : "0"}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsBalancePress(false);
                    setShowKeyboard(false);
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
          </View>
        </TouchableWithoutFeedback>
        {showKeyboard && (
          <View style={styles.keyboardContainer}>
            <AmountKeyboard
              handleNumberPress={handleNumberPress}
              handleDeletePress={handleKeyboardDeletePress}
              handleClearPress={handleClearPress}
              setShowKeyboard={setShowKeyboard}
            />
          </View>
        )}
      </Modal>
    </View>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary100,

    alignItems: "center",
    paddingTop: 30,
    flex: 1,
  },
  keyboardContainer: {
    height: "55%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    zIndex: 99,
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

  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(39,69,85,0.5)",
    flex: 1,
  },
  inputContanier: {
    height: 250,
    width: 325,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  title: { fontWeight: "bold", color: Colors.gray100, fontSize: 18 },
  input: {
    backgroundColor: "#fff1b9",
    height: 50,
    width: 250,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: Colors.gray100,
    justifyContent: "center",
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
});
