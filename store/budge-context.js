import { createContext, useContext, useState } from "react";

// 定义 context
export const BudgeContext = createContext({
  showBudgeCard: true,
  setShowBudge: () => {}, // 默认空函数
  budge: {},
  setBudge: () => {},
});

function BudgeContextProvider({ children }) {
  const [showBudgeCard, setShowBudgeCard] = useState(true); // 使用 useState 来管理日期状态
  const [budge, setBudge] = useState();

  // 设置日期的函数
  const handleSetShowBudge = (boolean) => {
    setShowBudgeCard(boolean);
  };

  const handleSetBudge = (amount, budgeType, startDate) => {
    setBudge({ amount: amount, type: budgeType, beginDate: startDate });
  };

  const value = {
    showBudgeCard: showBudgeCard,
    setShowBudgeCard: handleSetShowBudge, // 设置日期函数
    budge: budge,
    setBudge: handleSetBudge,
  };

  return (
    <BudgeContext.Provider value={value}>{children}</BudgeContext.Provider>
  );
}

export default BudgeContextProvider;
