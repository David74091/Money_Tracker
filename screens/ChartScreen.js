import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { VictoryPie, VictoryLabel } from "victory-native";
import { Colors } from "../constants/Colors";
import Icon from "../components/UI/Icon";
import {
  fetchAllExpenses,
  fetchCategoryTotalsBetweenDates,
} from "../database/database";
import ChartDatePicker from "../components/UI/ChartDatePicker";
import PickerTypeSelecter from "../components/UI/PickerTypeSelecter";
import {
  convertISODateToSQLiteFormat,
  getFormattedDate,
  subtractDaysFromDate,
  subtractMonthsFromDate,
  taiwanMidnight,
} from "../util/date";
import DatePicker from "../components/UI/DatePicker";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import AccountOptions from "../components/UI/AccountOptions";
const chartColorScale = [
  "#fe4365",
  "#fc9d9a",
  "#67d5b5",
  "#30a9d1",
  "#566270",
  "#a593e0",
  "#e53a40",
  "#58c9b9",
  "#534847",
  "#56a902",
  "#00dffc",
  "#fb616f",
  "#a5dff9",
  "#004166",
];

const ChartScreen = ({ navigation }) => {
  const [categoryColors, setCategoryColors] = useState({});
  const [account, setAccount] = useState("");

  const [showChageAccount, setShowChangeAccount] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickType, setPickType] = useState("");
  const [show, setShow] = useState(false);
  const [startDay, setStartDay] = useState(
    subtractMonthsFromDate(new Date(taiwanMidnight(new Date())), 1)
  );
  const [endDay, setEndDay] = useState(new Date(taiwanMidnight(new Date())));
  const [chartData, setChartData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [customPress, setCustomPress] = useState(false);
  const handleBackPress = () => {
    navigation.goBack();
  };

  //支出還是收入圖表
  const [chartType, setChartType] = useState("expense");

  const handleChageAccountPress = () => {
    setShowChangeAccount(true);
    setShow(true);
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
        <TouchableOpacity
          onPress={handleChageAccountPress}
          style={{
            backgroundColor: "#4f86c6",
            height: 50,
            width: 100,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            {account ? account : "切換帳戶"}
          </Text>
        </TouchableOpacity>
      ),
      headerTitleStyle: { color: Colors.gray100 },
      headerStyle: { backgroundColor: Colors.primary100 },
      headerShadowVisible: false,
      title: "支出統計",
    });
  }, [navigation, account]);

  useEffect(() => {
    console.log("dDDDDDD", categoryData);
  }, [categoryData]);

  useEffect(() => {
    fetchCategoryTotalsBetweenDates(
      convertISODateToSQLiteFormat(startDay),
      convertISODateToSQLiteFormat(endDay),
      account == "所有帳戶" ? "" : account,
      chartType
    )
      .then((data) => {
        setCategoryData(data);
        const formattedChartData = data.categoryTotals.map((item, index) => ({
          x: item.category,
          y: parseFloat(item.totalAmount),
        }));
        setChartData(formattedChartData);
        setIsLoading(false);

        const colors = {};
        formattedChartData.forEach((dataPoint, index) => {
          colors[dataPoint.x] = chartColorScale[index % chartColorScale.length];
        });
        setCategoryColors(colors);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [endDay, startDay, account, chartType]);

  const handleDateButtonPress = (date) => {
    switch (date) {
      case "year":
        setStartDay(subtractMonthsFromDate(endDay, 12));
        break;
      case "sixMonths":
        setStartDay(subtractMonthsFromDate(endDay, 6));
        break;
      case "month":
        setStartDay(subtractMonthsFromDate(endDay, 1));
        break;
      case "week":
        setStartDay(subtractDaysFromDate(endDay, 7));
        break;
      case "custom":
        setShow(true);
    }
  };

  const handleCustomDatePress = () => {
    setShow(true);
  };

  const handleOptionPress = (option) => {
    setAccount(option);
    setShow(false);
    setShowChangeAccount(false);
  };

  const handleArrowPress = (pressed) => {
    switch (pressed) {
      case "left":
        setChartType("expense");
        break;
      case "right":
        setChartType("income");
        break;
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.chartScreenContainer}>
      <TouchableOpacity
        onPress={handleCustomDatePress}
        style={styles.dateTextContainer}
      >
        <Text style={styles.dateText}>{`${getFormattedDate(
          startDay
        )} ~ ${getFormattedDate(endDay)}`}</Text>
      </TouchableOpacity>
      <View style={styles.datePickerContainer}>
        <ChartDatePicker
          setCustomPress={setCustomPress}
          customPress={customPress}
          handleDateButtonPress={handleDateButtonPress}
        />
      </View>
      <View style={styles.chartContainer}>
        {chartType == "income" && (
          <TouchableOpacity
            onPress={() => handleArrowPress("left")}
            style={styles.arrowLeft}
          >
            <Icon
              type="AntDesign"
              name="left"
              size={36}
              color={Colors.gray100}
            />
            <Text style={styles.arrowText}>{`支\n出`}</Text>
          </TouchableOpacity>
        )}
        <VictoryPie
          colorScale={[
            "#fe4365",
            "#fc9d9a",
            "#67d5b5",
            "#30a9d1",
            "#566270",
            "#a593e0",
            "#e53a40",
            "#58c9b9",
            "#534847",
            "#56a902",
            "#00dffc",
            "#fb616f",
            "#a5dff9",
            "#004166",
          ]}
          data={
            chartData.length !== 0
              ? chartData
              : [{ x: "沒有紀錄", y: 100, color: "#004166" }]
          }
          animate={{
            duration: 1000,
          }}
          width={325} // 設定圖表寬度
          height={325} // 設定圖表高度
          innerRadius={80} // 控制內徑，0表示空心
          style={{
            labels: { fill: Colors.gray100, fontSize: 16, fontWeight: "bold" },
          }}
        ></VictoryPie>
        {chartType == "expense" && (
          <TouchableOpacity
            onPress={() => handleArrowPress("right")}
            style={styles.arrowRight}
          >
            <Text style={styles.arrowText}>{`收\n入`}</Text>
            <Icon
              type="AntDesign"
              name="right"
              size={36}
              color={Colors.gray100}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.scrollContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: Colors.gray100,
            }}
          >
            {chartType == "income" ? "總收入" : "總支出"}：
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: Colors.gray100,
            }}
          >
            $ {categoryData.totalSum.toString()}
          </Text>
        </View>
        <View style={{ borderWidth: 1, opacity: 0.2, marginVertical: 5 }} />
        <FlatList
          data={categoryData.categoryTotals}
          keyExtractor={(item) => item.category}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                borderWidth: 1,
                borderColor: Colors.gray100,
                opacity: 0.2,
              }}
            />
          )}
          renderItem={({ item, index }) => (
            <View
              style={{
                height: 55,
                flexDirection: "row",
                alignItems: "center",

                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: Colors.gray100,
                  }}
                >
                  {index + 1}.
                </Text>
                <Icon
                  type={item.icon_type}
                  name={item.icon_name}
                  size={36}
                  color={categoryColors[item.category]}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: Colors.gray100,
                  }}
                >
                  {item.category}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: Colors.gray100,
                  }}
                >
                  {((item.totalAmount / categoryData.totalSum) * 100)
                    .toFixed(1)
                    .toString()}{" "}
                  %
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: Colors.gray100,
                  }}
                >
                  $ {item.totalAmount}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              此帳戶沒有紀錄
            </Text>
          }
        />
      </View>

      <Modal animationType="fade" transparent={true} visible={show}>
        <View
          style={[
            styles.modalContainer,
            !showDatePicker && { justifyContent: "center" },
          ]}
        >
          {showChageAccount && (
            <AccountOptions handleOptionPress={handleOptionPress} />
          )}
          {!showDatePicker && !showChageAccount && (
            <PickerTypeSelecter
              setCustomPress={setCustomPress}
              setShow={setShow}
              setPickType={setPickType}
              setShowDatePicker={setShowDatePicker}
              startDay={startDay}
              endDay={endDay}
            />
          )}

          {showDatePicker && (
            <DatePicker
              setShowDatePicker={setShowDatePicker}
              setShow={setShow}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              pickType={pickType}
              setStartDay={setStartDay}
              setEndDay={setEndDay}
              startDay={startDay}
              endDay={endDay}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ChartScreen;

const styles = StyleSheet.create({
  chartScreenContainer: {
    flex: 1,
    backgroundColor: Colors.primary100,
    alignItems: "center",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    color: Colors.gray100,
    fontSize: 24,
    fontWeight: "bold",
  },
  dateTextContainer: {
    marginTop: 20,
    backgroundColor: "white",
    height: 50,
    width: 360,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 10,
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  datePickerContainer: {
    marginTop: 20,
    shadowColor: Colors.gray100,
    shadowRadius: 4,
    shadowOffset: { height: 3 },
    shadowOpacity: 0.4,
  },
  modalContainer: {
    backgroundColor: "rgba(39,69,85,0.7)",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  numberContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: "37%",
    top: "41%",
  },
  arrowRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
  },
  arrowLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.gray100,
  },
});
