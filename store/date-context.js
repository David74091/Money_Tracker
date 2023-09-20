import { createContext, useContext, useState } from "react";
import { taiwanMidnight } from "../util/date";

// 定义 context
export const DateContext = createContext({
  screenDate: "",
  setScreenDate: () => {}, // 默认空函数
});

function DateContextProvider({ children }) {
  const [date, setDate] = useState(taiwanMidnight(new Date())); // 使用 useState 来管理日期状态

  // 设置日期的函数
  const handleSetDate = (newDate) => {
    setDate(newDate);
  };

  const value = {
    screenDate: date,
    setScreenDate: handleSetDate, // 设置日期函数
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}

export default DateContextProvider;
