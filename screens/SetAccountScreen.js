import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import AccountSetting from "./AccountSetting";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";
import {
  deleteAccountById,
  fetchAllAccounts,
  updateAccounts,
} from "../database/database";
import { useIsFocused } from "@react-navigation/native";
import LoadingOverlay from "../components/UI/LoadingOverlay";

const SetAccountScreen = ({ navigation }) => {
  const [newAccount, setNewAccount] = useState("");
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const [finishAdd, setFinishAdd] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [accountsData, setAccountsData] = useState();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeletePress = (id) => {
    deleteAccountById(id)
      .then(() => {
        console.log("刪除成功");
        setFinishAdd(!finishAdd);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPress = () => {
    setShowAddScreen(true);
  };

  const handleConfirmPress = () => {
    const updatedData = [newAccount, ...accountsData];
    updateAccounts(updatedData)
      .then(() => {
        console.log("儲存成功");
        setShowAddScreen(false);
        setFinishAdd(!finishAdd);
      })
      .catch((err) => {
        console.log(err);
      });
    setShowAddScreen(false);
  };

  const handleTextChange = (input) => {
    setNewAccount({ name: input, balance: 0 });
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
      headerRight: () => (
        <TouchableOpacity onPress={handleAddPress}>
          <Icon
            type="Ionicons"
            name="add-circle-outline"
            size={36}
            color={Colors.gray100}
          />
        </TouchableOpacity>
      ),
      headerTitleStyle: { color: Colors.gray100 },
      headerStyle: { backgroundColor: Colors.primary100 },
      headerShadowVisible: false,
      title: "帳戶管理",
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      fetchAllAccounts()
        .then((data) => {
          setAccountsData(data);
          console.log("accountData!!!!", accountsData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isFocused, finishAdd]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AccountSetting
        accountsData={accountsData}
        handleDeletePress={handleDeletePress}
        setFinishAdd={setFinishAdd}
        finishAdd={finishAdd}
        setAccountsData={setAccountsData}
      />
      <Modal animationType="fade" transparent={true} visible={showAddScreen}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.inputContanier}>
              <Text style={styles.title}>帳戶名稱</Text>
              <TextInput
                style={styles.input}
                returnKeyType="done"
                onChangeText={handleTextChange}
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddScreen(false);
                  }}
                  style={[styles.button, { backgroundColor: Colors.error }]}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                  >
                    取消
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirmPress}
                  style={styles.button}
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
      </Modal>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Transfer");
        }}
        style={styles.transferContainer}
      >
        <Icon
          type="MaterialCommunityIcons"
          name="bank-transfer"
          size={32}
          color={Colors.gray100}
        />
        <Text style={styles.transferText}>轉帳</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetAccountScreen;

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(39,69,85,0.5)",
    flex: 1,
  },
  transferInputContainer: {
    height: 500,
    width: 350,
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
  },
  button: {
    backgroundColor: Colors.sucess,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 12,
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
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  transferContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "white",
    height: 80,
    width: 120,
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    borderRadius: 100,
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  transferText: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.gray100,
  },
});
