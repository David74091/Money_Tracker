export const getFormattedDate = (date) => {
  return ` ${date.getFullYear()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
};

export const taiwanMidnight = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0, 0);
};

//月份加一
export const addOneMonthToDate = (date) => {
  const newDate = new Date(date); // 複製傳入的日期對象
  const currentMonth = newDate.getMonth();
  newDate.setMonth(currentMonth + 1);

  // 處理月份溢出
  if (newDate.getMonth() === currentMonth) {
    newDate.setFullYear(newDate.getFullYear() + 1); // 增加一年
    newDate.setMonth(0); // 設置為1月
  }

  return newDate;
};

//年份加一
export const addOneYearToDate = (date) => {
  const newDate = new Date(date); // 克隆传入的日期对象
  newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
};

//轉換成yyyy-mm-dd日期格式
export const convertISODateToSQLiteFormat = (isoDate) => {
  const dateObject = new Date(isoDate);
  const year = dateObject.getUTCFullYear();
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 減少指定月份數的函數
export const subtractMonthsFromDate = (date, months) => {
  const newDate = new Date(date); // 複製一份日期物件
  newDate.setMonth(newDate.getMonth() - months); // 減少指定的月份數
  return newDate; // 返回減少後的日期物件
};

// 減去指定天數的函數
export const subtractDaysFromDate = (date, days) => {
  const newDate = new Date(date); // 複製一份日期物件
  newDate.setDate(newDate.getDate() - days); // 減去指定的天數
  return newDate; // 返回減去後的日期物件
};

// 增加指定天數
export const updateDayAndAddMonth = (date, newDay) => {
  const newDate = new Date(date); // 複製日期對象
  newDate.setDate(newDay); // 設置日期對象的日字段為新的值

  // 增加一個月
  newDate.setMonth(newDate.getMonth() + 1);

  return newDate; // 返回更新後的日期對象
};
