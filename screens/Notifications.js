//Expo Notifications
//https://docs.expo.dev/versions/latest/sdk/notifications/
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import Icon from "../components/UI/Icon";
import { Colors } from "../constants/Colors";
import TimePicker from "../components/UI/TimePicker";
import * as Notifications from "expo-notifications";
import {
  deleteAllReminders,
  deleteRemindersTable,
  getAllReminders,
  insertOrUpdateReminder,
} from "../database/database";
import LoadingOverlay from "../components/UI/LoadingOverlay";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

//// START: NEWLY ADDED FUNCTIONS ////
const allowsNotificationsAsync = async () => {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

const requestPermissionsAsync = async () => {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
};
//// END: NEWLY ADDED FUNCTIONS ////

const NotificationsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [noteName, setNoteName] = useState("記帳時間到了~✍️");
  const [noteDate, setNoteDate] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(false);

  const [notificationId, setNotificationId] = useState(
    noteDate > 0 ? noteDate[0].notificationId : null
  );

  // 返回上一頁
  const handleBackPress = () => {
    navigation.goBack();
  };

  // 處理文本變化輸入
  const handleTextChange = (text) => {
    setNoteName(text);
  };

  //處理確認按鈕點擊
  const handleConfirmPress = async () => {
    //刪除提醒
    deleteNotification();

    // 關閉模態框;
    setShowModal(false);
    //// START: CALL FUNCTIONS HERE ////
    const hasPushNotificationPermissionGranted =
      await allowsNotificationsAsync();

    if (!hasPushNotificationPermissionGranted) {
      await requestPermissionsAsync();
    }
    const taiwanTime = "2023-09-10T15:50:00";
    console.log("taiwanTime", new Date(taiwanTime));
    console.log("選中的時間", new Date(selectedTime));

    //// END: CALL FUNCTIONS HERE ////
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: noteName,
        },
        trigger: {
          hour: selectedTime.getHours(),
          minute: selectedTime.getMinutes(),
          repeats: true,
        },
      });
      // 存储通知的ID到状态变量
      setNotificationId(id);

      console.log("通知成功創建，ID為:", id);
    } catch (error) {
      console.error("創建通知時出錯:", error);
    }

    insertOrUpdateReminder(noteName, selectedTime, notificationId)
      .then(() => {
        console.log("儲存成功");
        setActive(!active);
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
      title: "每日記帳提醒",
    });
  }, [navigation]);

  useEffect(() => {
    getAllReminders()
      .then((data) => {
        setNoteDate(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [active]);

  useEffect(() => {
    console.log("noteData", noteDate);
  }, [noteDate]);

  const deleteNotification = async () => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log("通知已成功删除");
    } catch (error) {
      console.error("删除通知时出错:", error);
    }
  };

  const handleDelete = () => {
    deleteAllReminders()
      .then(() => {
        deleteNotification();
        console.log("刪除成功");
      })
      .catch((err) => {
        console.log(err);
      });
    setActive(!active);
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.mainContainer}>
      {noteDate.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
          style={styles.noteContainer}
        >
          <TouchableOpacity
            onPress={handleDelete}
            style={{ position: "absolute", right: 20 }}
          >
            <Icon
              type="MaterialIcons"
              name="delete-forever"
              size={32}
              color={Colors.error}
            />
          </TouchableOpacity>
          <Text
            style={{ color: Colors.gray100, fontSize: 28, fontWeight: "bold" }}
          >
            {new Date(noteDate[0].time)
              .toLocaleTimeString("en-US", {
                timeZone: "Asia/Taipei",
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })
              .toString()}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
          style={styles.noteContainer}
        >
          <Text
            style={{ color: Colors.gray100, fontSize: 20, fontWeight: "bold" }}
          >
            沒有任何提醒，添加一個吧
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          setShowModal(true);
        }}
        style={styles.transferContainer}
      >
        <Text style={styles.transferText}>
          {noteDate.length > 0 ? "修改" : "添加"}
        </Text>
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View style={styles.modalContainer}>
          <View style={styles.inputContanier}>
            <Text style={styles.title}>每日提醒</Text>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: Colors.gray100,
                }}
              >
                名稱
              </Text>
            </View>
            <TextInput
              style={styles.input}
              returnKeyType="done"
              onChangeText={handleTextChange}
              value={noteName}
            />
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: Colors.gray100,
                }}
              >
                時間
              </Text>
              <TimePicker
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                noteDate={noteDate}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
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
      </Modal>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff1b9",
    height: 50,
    width: 250,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: Colors.gray100,
  },
  mainContainer: {
    backgroundColor: Colors.primary100,
    flex: 1,
    alignItems: "center",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "white",
    height: 80,
    width: 325,
    marginTop: 50,
    borderRadius: 12,
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  transferContainer: {
    alignItems: "center",
    justifyContent: "center",
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
  modalContainer: {
    backgroundColor: "rgba(39,69,85,0.7)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    height: 600,
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
  title: { fontWeight: "bold", color: Colors.gray100, fontSize: 18 },
});
