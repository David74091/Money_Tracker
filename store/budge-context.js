//棄用
import { createContext, useContext, useState } from "react";

export const BudgeContext = createContext({
  showBudgeCard: true,
  setShowBudge: () => {},
  budge: {},
  setBudge: () => {},
});

function BudgeContextProvider({ children }) {
  const [showBudgeCard, setShowBudgeCard] = useState(true);
  const [budge, setBudge] = useState();

  const handleSetShowBudge = (boolean) => {
    setShowBudgeCard(boolean);
  };

  const handleSetBudge = (amount, budgeType, startDate) => {
    setBudge({ amount: amount, type: budgeType, beginDate: startDate });
  };

  const value = {
    showBudgeCard: showBudgeCard,
    setShowBudgeCard: handleSetShowBudge,
    budge: budge,
    setBudge: handleSetBudge,
  };

  return (
    <BudgeContext.Provider value={value}>{children}</BudgeContext.Provider>
  );
}

export default BudgeContextProvider;
