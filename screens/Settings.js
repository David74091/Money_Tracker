import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { Colors } from "../constants/Colors";
import Icon from "../components/UI/Icon";

const Settings = ({ navigation }) => {
  const handleButtonPress = (text) => {
    navigation.navigate(text);
  };
  handleBackPress = () => {
    navigation.goBack();
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
      title: "設定",
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleButtonPress("Budge")}
        style={styles.item}
      >
        <Icon
          type="FontAwesome5"
          name="piggy-bank"
          size={28}
          color={Colors.gray100}
        />
        <Text style={styles.text}>預算編列</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress("SetAccountScreen")}
        style={styles.item}
      >
        <Icon
          type="MaterialIcons"
          name="account-balance-wallet"
          size={28}
          color={Colors.gray100}
        />

        <Text style={styles.text}>帳戶管理</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress("SetCategory")}
        style={styles.item}
      >
        <Icon type="AntDesign" name="tag" size={28} color={Colors.gray100} />
        <Text style={styles.text}>類別排序</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress("Notifications")}
        style={styles.item}
      >
        <Icon
          type="Ionicons"
          name="notifications"
          size={28}
          color={Colors.gray100}
        />
        <Text style={styles.text}>記帳提醒</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary100,
    alignItems: "center",
    paddingTop: 50,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: "80%",
    height: 80,
    borderRadius: 12,
    marginBottom: 30,
    flexDirection: "row",
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  text: {
    color: Colors.gray100,
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
