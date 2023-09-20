import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  DatePickerButton,
  MainCard,
  ExpensesList,
  BudgeCard,
  BottomTab,
} from "../components";
import { Colors } from "../constants/Colors";
import {
  fetchAllExpenses,
  fetchBudge,
  fetchExpenses,
  fetchRemainingBudget,
} from "../database/database";
import { DateContext } from "../store/date-context";
import { BudgeContext } from "../store/budge-context";
import Icon from "../components/UI/Icon";
import { useIsFocused } from "@react-navigation/native";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { convertISODateToSQLiteFormat } from "../util/date";

const Home = ({ navigation }) => {
  const [budgeCardRefresh, setBudgeCardRefresh] = useState(false);
  const isFocused = useIsFocused();
  const [showBudgeCard, setShowBudgeCard] = useState(true);
  const [mainCardType, setMainCardType] = useState("");
  const { screenDate, setScreenDate } = useContext(DateContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(true);

  //budgeCard
  const [budge, setBudge] = useState();
  const [remain, setRemain] = useState();
  const [progress, setProgress] = useState("100%");

  // useEffect(() => {
  //   setScreenDate(screenDate);
  // }, [selectedDate]);

  // useEffect(() => {
  //   console.log("執行中");
  //   fetchAllExpenses()
  //     .then((result) => {
  //       console.log("全部資料：", result);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [navigation, screenDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBudge();
        setBudge(response);

        if (!!response) {
          const remainData = await fetchRemainingBudget(
            convertISODateToSQLiteFormat(new Date(response.beginDate)),
            convertISODateToSQLiteFormat(new Date(response.endDate))
          );
          setRemain(remainData);
          setProgress(
            ((parseFloat(remainData) / response.amount) * 100).toString() + "%"
          );
        } else {
          setRemain(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isFocused, navigation]);

  useEffect(() => {
    setBudgeCardRefresh(!budgeCardRefresh);
  }, []);

  useEffect(() => {
    fetchBudge()
      .then((data) => {
        setShowBudgeCard(
          data.showOnMainScreen == null ? true : !!data.showOnMainScreen
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [navigation, isFocused]);

  useEffect(() => {
    console.log("執行中");
    fetchAllExpenses()
      .then((result) => {
        console.log("All", result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [navigation, screenDate]);

  useEffect(() => {
    console.log();
  }, [remain, budge]);

  const handleLeftPress = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
    setScreenDate(newDate); // Update screenDate as well
  };

  const handleRightPress = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
    setScreenDate(newDate); // Update screenDate as well
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.homeContainer}>
      <View style={styles.topContainer}>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={handleLeftPress}>
            <Icon
              type="AntDesign"
              name="left"
              size={36}
              color={Colors.gray100}
            />
          </TouchableOpacity>
          <DatePickerButton
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <TouchableOpacity onPress={handleRightPress}>
            <Icon
              type="AntDesign"
              name="right"
              size={36}
              color={Colors.gray100}
            />
          </TouchableOpacity>
        </View>
        <MainCard setMainCardType={setMainCardType} />
        <ExpensesList mainCardType={mainCardType} />
      </View>
      <View
        style={[styles.bottomContainer, !showBudgeCard && { height: "18%" }]}
      >
        {showBudgeCard && (
          <View style={{ height: "35%", width: "100%" }}>
            <BudgeCard remain={remain} budge={budge} progress={progress} />
          </View>
        )}
        <View style={{ flex: "65%", width: "100%" }}>
          <BottomTab />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: Colors.primary100,
    alignItems: "center",
  },
  topContainer: {
    flex: 1,
  },
  bottomContainer: {
    width: "100%",
    height: "28%",
    alignItems: "center",
  },
  dateContainer: {
    marginTop: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
