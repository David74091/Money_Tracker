//棄用
import { createContext, useContext, useState } from "react";
import { taiwanMidnight } from "../util/date";

// 定义 context
export const DateContext = createContext({
  screenDate: "",
  setScreenDate: () => {},
});

function DateContextProvider({ children }) {
  const [date, setDate] = useState(taiwanMidnight(new Date()));

  const handleSetDate = (newDate) => {
    setDate(newDate);
  };

  const value = {
    screenDate: date,
    setScreenDate: handleSetDate,
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}

export default DateContextProvider;
