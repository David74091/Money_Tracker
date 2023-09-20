import { StatusBar } from "expo-status-bar";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Home,
  AddIncome,
  AddExpense,
  EditExpense,
  ItemDetail,
  Budge,
  EditBudge,
  ChartScreen,
  Settings,
  AccountSetting,
  CategorySetting,
  Notifications,
  SetCategory,
  SetAccountScreen,
  Transfer,
} from "./screens";

//確保資料庫初始化前不要加載完成應用程式
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { init } from "./database/database";
import { Date, DatePicker } from "./components/UI/Date";
import DateContextProvider from "./store/date-context";
import BudgeContextProvider from "./store/budge-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const initDb = async () => {
      try {
        await init();
        await SplashScreen.hideAsync();
      } catch (err) {
        console.log(err);
      }
    };
    initDb();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <BudgeContextProvider>
        <DateContextProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {/* <Stack.Screen name="date" component={DatePicker} /> */}
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AddIncome"
                component={AddIncome}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="AddExpense"
                component={AddExpense}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="ItemDetail"
                component={ItemDetail}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="Budge"
                component={Budge}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="EditBudge"
                component={EditBudge}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="EditExpense"
                component={EditExpense}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="ChartScreen"
                component={ChartScreen}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                  presentation: "fullScreenModal",
                }}
              />

              <Stack.Screen
                name="SetCategory"
                component={SetCategory}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="SetAccountScreen"
                component={SetAccountScreen}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
              <Stack.Screen
                name="Transfer"
                component={Transfer}
                options={{
                  presentation: "fullScreenModal",
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DateContextProvider>
      </BudgeContextProvider>
    </>
  );
}
