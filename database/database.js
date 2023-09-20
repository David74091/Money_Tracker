//Expo SQLite
//https://docs.expo.dev/versions/latest/sdk/sqlite/
import * as SQLite from "expo-sqlite";
import { Account, Expense } from "../models/expense";
import {
  addOneMonthToDate,
  addOneYearToDate,
  taiwanMidnight,
} from "../util/date";

const expenseOptions = [
  {
    type: "MaterialCommunityIcons",
    icon: "bread-slice",
    label: "早餐",
    value: "早餐",
  },
  {
    type: "MaterialIcons",
    icon: "lunch-dining",
    label: "午餐",
    value: "午餐",
  },
  {
    type: "MaterialCommunityIcons",
    icon: "food-turkey",
    label: "晚餐",
    value: "晚餐",
  },
  {
    type: "MaterialCommunityIcons",
    icon: "train",
    label: "交通",
    value: "交通",
  },
  {
    type: "Feather",
    icon: "shopping-cart",
    label: "日常用品",
    value: "日常用品",
  },
  {
    type: "MaterialCommunityIcons",
    icon: "party-popper",
    label: "娛樂",
    value: "娛樂",
  },
  {
    type: "MaterialCommunityIcons",
    icon: "handshake-outline",
    label: "社交",
    value: "社交",
  },
  {
    type: "FontAwesome5",
    icon: "shopping-bag",
    label: "購物",
    value: "購物",
  },
  {
    type: "MaterialIcons",
    icon: "house",
    label: "房租",
    value: "房租",
  },
  {
    type: "Feather",
    icon: "gift",
    label: "禮物",
    value: "禮物",
  },
  {
    type: "Ionicons",
    icon: "md-medkit-outline",
    label: "醫療",
    value: "醫療",
  },
  {
    type: "AntDesign",
    icon: "linechart",
    label: "投資",
    value: "投資",
  },
  {
    type: "FontAwesome",
    icon: "credit-card",
    label: "卡費",
    value: "卡費",
  },
  {
    type: "MaterialCommunityIcons",
    icon: "bank-transfer-out",
    label: "轉帳",
    value: "轉帳",
  },
  {
    type: "MaterialCommunityIcons",
    icon: "label-outline",
    label: "其他",
    value: "其他",
  },
];

const incomeOptions = [
  {
    type: "MaterialIcons",
    icon: "business-center",
    label: "薪水",
    value: "薪水",
  },
  {
    type: "MaterialCommunityIcons",
    icon: "account-cash",
    label: "生活費",
    value: "生活費",
  },
  {
    type: "AntDesign",
    icon: "redenvelopes",
    label: "紅包",
    value: "紅包",
  },
  {
    type: "FontAwesome5",
    icon: "money-bill-wave",
    label: "營業所得",
    value: "營業所得",
  },
  {
    type: "Ionicons",
    icon: "school",
    label: "補助金",
    value: "補助金",
  },
  {
    type: "FontAwesome",
    icon: "trophy",
    label: "獎金",
    value: "獎金",
  },
  {
    type: "FontAwesome",
    icon: "line-chart",
    label: "投資所得",
    value: "投資所得",
  },
];

//創建資料庫
const database = SQLite.openDatabase("expense.db");

// 新增一個檢查並更新預算的函數
const checkAndResetBudget = () => {
  return new Promise((resolve, reject) => {
    fetchBudge()
      .then((budge) => {
        if (budge && budge.reset) {
          // 检查 budge 是否存在
          const currentDate = taiwanMidnight(new Date());
          const endDate = taiwanMidnight(new Date(budge.endDate));

          if (currentDate >= endDate) {
            let newEndDate = taiwanMidnight(new Date(endDate));
            let newAmount = budge.tempAmount;

            if (budge.type === "month") {
              newEndDate = addOneMonthToDate(newEndDate);
            } else if (budge.type === "year") {
              newEndDate = addOneYearToDate(newEndDate);
            }

            // 更新預算紀錄的 endDate 和 amount
            updateBudgeEndDateAndAmount(newEndDate, newAmount)
              .then(() => {
                console.log("預算已重置");
                resolve(); // 成功時解析 Promise
              })
              .catch((error) => {
                console.error("更新預算时发生错误", error);
                reject(error); // 失敗時拒絕 Promise
              });
          } else {
            resolve(); // 當不需要重置預算時也解析 Promise
          }
        } else {
          // 如果沒有預算紀錄，可以執行默認操作，或根據需求處理
          console.log("没有预算记录或未设置重置");
          resolve();
        }
      })
      .catch((error) => {
        console.error("檢查並更新預算时发生错误", error);
        reject(error); // 失敗時拒絕 Promise
      });
  });
};

// 更新預算表中的 endDate 和 amount，並將 beginDate 設置為今天的日期
const updateBudgeEndDateAndAmount = (newEndDate, newAmount) => {
  const currentDate = taiwanMidnight(new Date()); // 獲取當前日期
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "UPDATE budge SET endDate = ?, amount = ?, beginDate = ? WHERE id = 1",
        [
          newEndDate.toISOString().split("T")[0],
          newAmount,
          formattedCurrentDate, // 將 beginDate 設置為當前日期
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// 初始化函數
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        // 初始化 expenses 表格
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY, inserDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, date TEXT, amount TEXT, description TEXT, type TEXT, category TEXT, account TEXT, icon_type TEXT, icon_name TEXT)",
          [],
          () => {
            console.log("expenses 表格初始化成功");

            // 初始化 accounts 表格
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, name TEXT, balance REAL)",
              [],
              () => {
                console.log("accounts 表格初始化成功");

                // 檢查是否已存在預設帳戶紀錄
                tx.executeSql(
                  "SELECT COUNT(*) AS count FROM accounts",
                  [],
                  (_, result) => {
                    const count = result.rows.item(0).count;
                    if (count === 0) {
                      // 插入預設帳戶紀錄
                      const defaultAccounts = [
                        { name: "現金", balance: 0 },
                        { name: "玉山銀行", balance: 0 },
                        { name: "國泰世華", balance: 0 },
                        { name: "中國信託", balance: 0 },
                        { name: "台北富邦", balance: 0 },
                        { name: "中華郵政", balance: 0 },
                        { name: "Line Bank", balance: 0 },
                        { name: "將來銀行", balance: 0 },
                        // 添加更多預設帳戶
                      ];

                      defaultAccounts.forEach((account) => {
                        tx.executeSql(
                          "INSERT INTO accounts (name, balance) VALUES (?, ?)",
                          [account.name, account.balance],
                          () => {
                            console.log(
                              `插入預設帳戶紀錄成功：${account.name}`
                            );
                          },
                          (_, error) => {
                            console.log(
                              `插入預設帳戶紀錄失敗：${account.name}`,
                              error
                            );
                          }
                        );
                      });
                    }
                  },
                  (_, error) => {
                    console.log("檢查帳戶紀錄時出錯", error);
                  }
                );
              },
              (_, error) => {
                console.log("accounts 表格初始化出錯", error);
              }
            );
          },
          (_, error) => {
            console.log("expenses 表格初始化失敗", error);
          }
        );

        // 初始化 budge 表格
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS budge (id INTEGER PRIMARY KEY, amount REAL, tempAmount REAL, type TEXT, beginDate TEXT, endDate TEXT, reset BOOLEAN, showOnMainScreen BOOLEAN, startDate TEXT)",
          [],
          () => {
            console.log("budge 表格初始化成功");

            // 在初始化後檢查並更新預算
            tx.executeSql(
              "SELECT endDate, reset FROM budge WHERE id = 1",
              [],
              (_, result) => {
                if (result.rows.length > 0) {
                  const budgeData = result.rows.item(0);
                  const endDate = new Date(budgeData.endDate);
                  const currentDate = taiwanMidnight(new Date());

                  if (currentDate >= endDate && !budgeData.reset) {
                    // 如果當前日期大於等於 endDate 且 reset 為 false，則刪除 budge 表格中的全部數據
                    tx.executeSql(
                      "DELETE FROM budge",
                      [],
                      () => {
                        console.log("已刪除 budge 表格中的全部數據");
                      },
                      (_, error) => {
                        console.log("刪除 budge 表格數據時出錯", error);
                      }
                    );
                  }
                }
              },
              (_, error) => {
                console.log("查詢 budge 表格數據時出錯", error);
              }
            );
          },
          (_, error) => {
            console.log("budge 表格初始化失败", error);
          }
        );

        // 初始化 expenseCategory 表格
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS expenseCategory (id INTEGER PRIMARY KEY, type TEXT, icon TEXT, label TEXT, value TEXT)",
          [],
          () => {
            console.log("expenseCategory 表格初始化成功");
            //檢查是否已存在類別紀錄
            tx.executeSql(
              "SELECT COUNT(*) AS count FROM expenseCategory",
              [],
              (_, result) => {
                const count = result.rows.item(0).count;
                if (count === 0) {
                  // 插入類別數據
                  expenseOptions.forEach((category) => {
                    tx.executeSql(
                      "INSERT INTO expenseCategory (type, icon, label, value) VALUES (?, ?, ?, ?)",
                      [
                        category.type,
                        category.icon,
                        category.label,
                        category.value,
                      ],
                      () => {
                        console.log(`插入類別成功：${category.label}`);
                      },
                      (_, error) => {
                        console.log(`插入類別失败：${category.label}`, error);
                      }
                    );
                  });
                }
              },
              (_, error) => {
                console.log("檢查 expenseCategory 表格紀錄時出錯", error);
              }
            );
          },
          (_, error) => {
            console.log("expenseCategory 表格初始化失败", error);
          }
        );

        // 初始化 incomeCategory 表格
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS incomeCategory (id INTEGER PRIMARY KEY, type TEXT, icon TEXT, label TEXT, value TEXT)",
          [],
          () => {
            console.log("incomeCategory 表格初始化成功");
            // 檢查是否已存在收入類別紀錄
            tx.executeSql(
              "SELECT COUNT(*) AS count FROM incomeCategory",
              [],
              (_, result) => {
                const count = result.rows.item(0).count;
                if (count === 0) {
                  //插入默認收入類別紀錄
                  incomeOptions.forEach((category) => {
                    tx.executeSql(
                      "INSERT INTO incomeCategory (type, icon, label, value) VALUES (?, ?, ?, ?)",
                      [
                        category.type,
                        category.icon,
                        category.label,
                        category.value,
                      ],
                      () => {
                        console.log(`插入收入類别成功：${category.label}`);
                      },
                      (_, error) => {
                        console.log(
                          `插入收入類别失败：${category.label}`,
                          error
                        );
                      }
                    );
                  });
                }
              },
              (_, error) => {
                console.log("檢查 incomeCategory 表格紀錄數量時出錯", error);
              }
            );
          },
          (_, error) => {
            console.log("incomeCategory 表格初始化失败", error);
          }
        );
        // 在初始化後檢查並更新預算
        checkAndResetBudget()
          .then(() => {
            console.log("預算檢查和重置完成");
          })
          .catch((error) => {
            console.error("預算檢查和重置時發生錯誤", error);
          });
      },
      (_, error) => {
        console.log("數據庫事務初始化失敗", error);
        reject(error);
      },
      (_, success) => {
        console.log("數據庫事務初始化成功");
        resolve(success);
      }
    );
  });

  return promise;
};

//將資料插入expenses資料表內
export const insertExpense = (
  date,
  amount,
  description,
  type,
  category,
  account,
  icon
) => {
  // 格式化日期为 "YYYY-MM-DD" 格式
  const formattedDate = new Date(date).toISOString().split("T")[0];

  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // 更新帳戶餘額
      tx.executeSql(
        "UPDATE accounts SET balance = balance + ? WHERE name = ?",
        [type === "expense" ? -amount : amount, account],
        (_, balanceResult) => {
          if (balanceResult.rowsAffected > 0) {
            // 更新帳戶餘額成功後，插入交易紀錄
            tx.executeSql(
              "INSERT INTO expenses (date, amount, description, type, category, account, icon_type, icon_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                formattedDate,
                amount,
                description,
                type,
                category,
                account,
                icon.type,
                icon.name,
              ],
              (_, insertResult) => {
                console.log("插入交易記錄成功");
                resolve(insertResult);
              },
              (_, error) => {
                console.log("插入交易記錄失敗");
                reject(error);
              }
            );
          } else {
            console.log("更新帳戶餘額失敗");
            reject(new Error("更新帳戶餘額失敗"));
          }
        },
        (_, error) => {
          console.log("更新帳戶餘額失敗");
          reject(error);
        }
      );
    });
  });

  return promise;
};

//抓出符合日期的資料
export const fetchExpenses = (targetDate) => {
  // 將傳遞的日期轉換為資料庫中日期格式的字串
  const formattedDate = new Date(targetDate).toISOString().split("T")[0];

  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM expenses WHERE date = ?",
        [formattedDate], // 使用格式化后的日期
        (_, result) => {
          const expenses = [];
          for (let db of result.rows._array) {
            expenses.push(
              new Expense(
                db.id,
                db.date,
                db.amount,
                db.description,
                db.type,
                db.category,
                db.account,
                db.icon_type,
                db.icon_name
              )
            );
          }
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          console.log("抓取資料失敗");
        }
      );
    });
  });

  return promise;
};

export const fetchAllExpenses = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM expenses",
        [], // 將傳入的日期作為參數傳遞給查詢
        (_, result) => {
          const expenses = [];
          for (let db of result.rows._array) {
            expenses.push(
              new Expense(
                db.id,
                db.date,
                db.amount,
                db.description,
                db.type,
                db.category,
                db.account,
                db.icon_type,
                db.icon_name
              )
            );
          }
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          console.log("抓取資料失敗");
        }
      );
    });
  });

  return promise;
};

export const fetchAllAccounts = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM accounts",
        [], // 將傳入的日期作為參數傳遞給查詢
        (_, result) => {
          const expenses = [];
          for (let db of result.rows._array) {
            expenses.push(new Account(db.id, db.name, db.balance));
          }
          resolve(expenses);
        },
        (_, error) => {
          reject(error);
          console.log("抓取資料失敗");
        }
      );
    });
  });

  return promise;
};

//抓出符合id的資料
export const fetchExpenseById = (id) => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM expenses WHERE id = ?",
        [id],
        (_, result) => {
          const db = result.rows._array[0];
          const place = new Expense(
            db.id,
            db.date,
            db.amount,
            db.description,
            db.type,
            db.category,
            db.account,
            db.icon_type,
            db.icon_name
          );
          console.log("fetchById成功");
          resolve(place);
        },
        (_, error) => {
          console.log("fetchById失敗");
          reject(error);
        }
      );
    });
  });
  return promise;
};

//刪除指定的檔案
export const deleteExpenseById = (id) => {
  const promise = new Promise((resolve, reject) => {
    let expenseData; // 儲存支出記錄的數據

    database.transaction((tx) => {
      // 從支出記錄中取得資料（包括金額和關聯的帳戶）
      tx.executeSql(
        "SELECT * FROM expenses WHERE id = ?",
        [id],
        (_, result) => {
          const expense = result.rows._array[0];
          expenseData = {
            amount: expense.amount,
            account: expense.account,
            type: expense.type,
          };

          // 刪除支出記錄
          tx.executeSql(
            "DELETE FROM expenses WHERE id = ?",
            [id],
            (_, deleteResult) => {
              console.log("deleteById成功");

              // 還原相關帳戶的餘額
              if (expenseData.type === "expense") {
                // 如果原始記錄是支出，將金額加回帳戶餘額
                tx.executeSql(
                  "UPDATE accounts SET balance = balance + ? WHERE name = ?",
                  [expenseData.amount, expenseData.account],
                  (_, updateResult) => {
                    console.log("還原帳戶餘額成功");
                    resolve(deleteResult); // 成功删除并还原余额
                  },
                  (_, error) => {
                    console.log("還原帳戶餘額失敗");
                    reject(error);
                  }
                );
              } else {
                // 如果原始記錄是收入，將金額從帳戶餘額中減去
                tx.executeSql(
                  "UPDATE accounts SET balance = balance - ? WHERE name = ?",
                  [expenseData.amount, expenseData.account],
                  (_, updateResult) => {
                    console.log("還原帳戶餘額成功");
                    resolve(deleteResult); // 成功刪除並還原餘額
                  },
                  (_, error) => {
                    console.log("還原帳戶餘額失敗");
                    reject(error);
                  }
                );
              }
            },
            (_, error) => {
              console.log("deleteById失敗");
              reject(error);
            }
          );
        },
        (_, error) => {
          console.log("查詢支出記錄失敗");
          reject(error);
        }
      );
    });
  });
  return promise;
};

//編輯指定檔案
export const updateExpenseById = (
  id,
  date,
  amount,
  description,
  category,
  account,
  icon_type,
  icon_name
) => {
  const promise = new Promise((resolve, reject) => {
    console.log("dbDate", date);
    database.transaction((tx) => {
      const query = `
        UPDATE expenses 
        SET date = ?, amount = ?, description = ?, category = ?, account = ?, icon_type = ?, icon_name = ?
        WHERE id = ?;
      `;
      tx.executeSql(
        query,
        [
          date,
          amount,
          description,
          category,
          account,
          icon_type,
          icon_name,
          id,
        ],
        (_, result) => {
          console.log("updateById成功");
          resolve(result);
        },
        (_, error) => {
          console.log("updateById失敗");
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const createOrUpdateBudge = (
  amount,
  type,
  beginDate,
  endDate,
  reset,
  showOnMainScreen,
  startDate
) => {
  const promise = new Promise((resolve, reject) => {
    const resetInt = reset ? 1 : 0;
    const showOnMainScreenInt = showOnMainScreen ? 1 : 0;
    const tempAmount = amount;

    database.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS budge (id INTEGER PRIMARY KEY, amount REAL, tempAmount REAL, type TEXT, beginDate TEXT, endDate TEXT, reset BOOLEAN, showOnMainScreen BOOLEAN, startDate TEXT)"
      );

      tx.executeSql(
        "INSERT OR REPLACE INTO budge (id, amount, tempAmount, type, beginDate, endDate, reset, showOnMainScreen, startDate) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          amount,
          tempAmount,
          type,
          beginDate,
          endDate,
          resetInt,
          showOnMainScreenInt,
          startDate,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

//編輯主畫面是否可見
export const updateShowOnMainScreen = (showOnMainScreen) => {
  const promise = new Promise((resolve, reject) => {
    const showOnMainScreenInt = showOnMainScreen ? 1 : 0; // 轉換布林值為整數

    database.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS budge (id INTEGER PRIMARY KEY, amount REAL, type TEXT, beginDate TEXT, endDate TEXT, reset BOOLEAN, showOnMainScreen BOOLEAN)"
      );

      // 更新 showOnMainScreen 欄位
      tx.executeSql(
        "UPDATE budge SET showOnMainScreen = ? WHERE id = 1",
        [showOnMainScreenInt],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const fetchBudge = () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM budge",
        [],
        (_, result) => {
          resolve(result.rows._array[0]);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

//計算剩餘預算
export const fetchRemainingBudget = (startDate, endDate) => {
  console.log("startDate:", startDate);
  console.log("endDate:", endDate);

  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT amount FROM budge WHERE id = 1",
        [],
        (_, result) => {
          const budgeAmount = result.rows._array[0]?.amount || 0;

          tx.executeSql(
            "SELECT SUM(amount) AS totalAmount FROM expenses WHERE type = ? AND date >= ? AND date <= ?",
            ["expense", startDate, endDate],
            (_, result) => {
              const totalExpense = result.rows._array[0]?.totalAmount || 0;
              const remainingBudget = budgeAmount - totalExpense;
              resolve(remainingBudget);
              console.log("budgeAmount:", budgeAmount);
              console.log("totalExpense:", totalExpense);
              console.log("remainingBudget:", remainingBudget);
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

//抓出兩個指定日期之間的支出類別分別的金額
export const fetchCategoryTotalsBetweenDates = (
  startDate,
  endDate,
  account,
  type // 新增 type 参数
) => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      let query =
        "SELECT category, icon_name, icon_type, SUM(CAST(amount AS REAL)) AS totalAmount FROM expenses WHERE date >= ? AND date <= ?";
      const queryParams = [startDate, endDate];

      if (account) {
        query += " AND account = ?";
        queryParams.push(account);
      }

      // 根据 type 进行过滤
      if (type === "expense") {
        query += " AND type = 'expense'";
      } else if (type === "income") {
        query += " AND type = 'income'";
      }

      query += " GROUP BY category, icon_name, icon_type";

      tx.executeSql(
        query,
        queryParams,
        (_, result) => {
          const categoryTotals = result.rows._array.map((row) => ({
            category: row.category,
            icon_name: row.icon_name,
            icon_type: row.icon_type,
            totalAmount: row.totalAmount,
          }));

          // 计算总数
          const totalSum = categoryTotals.reduce(
            (sum, category) => sum + category.totalAmount,
            0
          );

          // 返回数据
          resolve({ categoryTotals, totalSum });
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

//取得支出類別
export const getExpenseCategories = () => {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM expenseCategory",
          [],
          (_, result) => {
            const categories = result.rows._array;
            resolve(categories);
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (_, error) => {
        reject(error);
      }
    );
  });
};

//存入新順序的updateExpenseCategories

export const updateExpenseCategories = (sortedData) => {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        // 刪除現有數據
        tx.executeSql(
          "DELETE FROM expenseCategory",
          [],
          () => {
            // 插入新的排序後數據
            sortedData.forEach((item, index) => {
              tx.executeSql(
                "INSERT INTO expenseCategory (type, icon, label, value) VALUES (?, ?, ?, ?)",
                [item.type, item.icon, item.label, item.value],
                () => {
                  if (index === sortedData.length - 1) {
                    // 所有插入操作完成後，提交事務
                    resolve();
                  }
                },
                (_, error) => {
                  // 插入資料失敗
                  reject(error);
                }
              );
            });
          },
          (_, error) => {
            // 刪除資料失敗
            reject(error);
          }
        );
      },
      (_, error) => {
        // 事務執行失敗
        reject(error);
      }
    );
  });
};

// 取得收入類別
export const getIncomeCategories = () => {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM incomeCategory",
          [],
          (_, result) => {
            const categories = result.rows._array;
            resolve(categories);
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (_, error) => {
        reject(error);
      }
    );
  });
};

// 存入新順序的 updateIncomeCategories
export const updateIncomeCategories = (sortedData) => {
  return new Promise((resolve, reject) => {
    // 開始事務
    database.transaction(
      (tx) => {
        // 刪除現有數據
        tx.executeSql(
          "DELETE FROM incomeCategory",
          [],
          () => {
            // 插入新的排序後數據
            sortedData.forEach((item, index) => {
              tx.executeSql(
                "INSERT INTO incomeCategory (type, icon, label, value) VALUES (?, ?, ?, ?)",
                [item.type, item.icon, item.label, item.value],
                () => {
                  if (index === sortedData.length - 1) {
                    // 所有插入操作完成後，提交事務
                    resolve();
                  }
                },
                (_, error) => {
                  // 插入資料失敗
                  reject(error);
                }
              );
            });
          },
          (_, error) => {
            // 刪除數據失败
            reject(error);
          }
        );
      },
      (_, error) => {
        // 事務執行失敗
        reject(error);
      }
    );
  });
};

// 更新 accounts 資料表
export const updateAccounts = (sortedData) => {
  return new Promise((resolve, reject) => {
    // 開始事務
    database.transaction(
      (tx) => {
        // 刪除現有數據
        tx.executeSql(
          "DELETE FROM accounts",
          [],
          () => {
            // 插入新的排序後數據
            sortedData.forEach((item, index) => {
              tx.executeSql(
                "INSERT INTO accounts (name, balance) VALUES (?, ?)",
                [item.name, item.balance],
                () => {
                  if (index === sortedData.length - 1) {
                    // 所有插入操作完成後，提交事務
                    resolve();
                  }
                },
                (_, error) => {
                  // 插入資料失敗
                  reject(error);
                }
              );
            });
          },
          (_, error) => {
            // 刪除數據失败
            reject(error);
          }
        );
      },
      (_, error) => {
        // 事務執行失敗
        reject(error);
      }
    );
  });
};

export const deleteAccountById = (id) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM accounts WHERE id = ?",
        [id],
        (_, result) => {
          console.log("刪除資料成功");
          resolve(result);
        },
        (_, error) => {
          console.log("刪除資料失敗");
          reject(error);
        }
      );
    });
  });
};

//新增帳戶餘額
export const setBalanceById = (id, newBalance) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "UPDATE accounts SET balance = ? WHERE id = ?",
        [newBalance, id],
        (_, result) => {
          console.log("更新帳戶餘額成功");
          resolve(result);
        },
        (_, error) => {
          console.log("更新帳戶餘額失敗");
          reject(error);
        }
      );
    });
  });
};

// 執行帳戶之間的資金轉移（不檢查餘額）
export const transferFunds = (fromAccount, toAccount, amount) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // 直接從轉出帳戶中扣除金額
      tx.executeSql(
        "UPDATE accounts SET balance = balance - ? WHERE name = ?",
        [amount, fromAccount],
        (_, updateResult) => {
          if (updateResult.rowsAffected > 0) {
            // 更新成功，現在更新轉入帳戶餘額
            tx.executeSql(
              "UPDATE accounts SET balance = balance + ? WHERE name = ?",
              [amount, toAccount],
              (_, updateToAccountResult) => {
                if (updateToAccountResult.rowsAffected > 0) {
                  // 轉帳成功，提交事務
                  resolve();
                } else {
                  // 更新轉入帳戶餘額失敗
                  reject(new Error("更新轉入帳戶餘額失敗，請稍後重試。"));
                }
              },
              (_, error) => {
                // 更新轉入帳戶餘額時出錯
                reject(error);
              }
            );
          } else {
            // 更新轉出帳戶餘額失敗
            reject(new Error("更新轉出帳戶餘額失敗，請稍後重試。"));
          }
        },
        (_, error) => {
          // 更新轉出帳戶餘額時出錯
          reject(error);
        }
      );
    });
  });
};

export const insertOrUpdateReminder = (name, time, notificationId) => {
  return new Promise((resolve, reject) => {
    const timeString = time.toISOString();

    database.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY, name TEXT, time TEXT, notificationId TEXT);",
        [],
        () => {
          console.log("提醒表已建立或已存在");

          // 查找是否已存在提醒
          tx.executeSql(
            "SELECT * FROM reminders LIMIT 1;",
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                // 表中沒有提醒，插入新提醒
                tx.executeSql(
                  "INSERT INTO reminders (name, time, notificationId) VALUES (?, ?, ?);",
                  [name, timeString, notificationId], // 插入日期字符串和通知ID
                  (_, result) => {
                    console.log("提醒已插入");
                    resolve(result);
                  },
                  (_, error) => {
                    console.error("插入提醒時出錯：", error);
                    reject(error);
                  }
                );
              } else {
                // 表中已有提醒，更新現有提醒
                tx.executeSql(
                  "UPDATE reminders SET name = ?, time = ?, notificationId = ?;",
                  [name, timeString, notificationId], // 更新提醒名称、时间和通知ID
                  (_, result) => {
                    console.log("提醒已更新");
                    resolve(result);
                  },
                  (_, error) => {
                    console.error("更新提醒時出錯：", error);
                    reject(error);
                  }
                );
              }
            },
            (_, error) => {
              console.error("查詢提醒時出錯：", error);
              reject(error);
            }
          );
        },
        (_, error) => {
          console.error("建立提醒表時發生錯誤：", error);
          reject(error);
        }
      );
    });
  });
};

export const getAllReminders = () => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // 查詢前先檢查表是否存在
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='reminders';",
        [],
        (_, result) => {
          if (result.rows.length === 0) {
            // 如果表不存在，則傳回空數組
            console.log("提醒表不存在");
            resolve([]);
          } else {
            // 查詢所有提醒
            tx.executeSql(
              "SELECT * FROM reminders;",
              [],
              (_, { rows }) => {
                const reminders = rows._array; // 获取查询结果数组
                console.log("獲取所有提醒成功");
                resolve(reminders);
              },
              (_, error) => {
                console.error("查詢提醒時出錯：", error);
                reject(error);
              }
            );
          }
        },
        (_, error) => {
          console.error("檢查提醒表是否存在時發生錯誤：", error);
          reject(error);
        }
      );
    });
  });
};

export const deleteAllReminders = () => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, time TEXT, notificationId TEXT);",
        [],
        () => {
          console.log("提醒表已建立或已存在");

          // 删除所有提醒
          tx.executeSql(
            "DELETE FROM reminders;",
            [],
            (_, result) => {
              console.log("提醒表已建立或已存在");
              resolve(result);
            },
            (_, error) => {
              console.error("刪除提醒時發生錯誤：", error);
              reject(error);
            }
          );
        },
        (_, error) => {
          console.error("建立提醒表時發生錯誤：", error);
          reject(error);
        }
      );
    });
  });
};

export const deleteRemindersTable = () => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE IF EXISTS reminders;",
        [],
        (_, result) => {
          console.log("刪除 reminders 表格成功");
          resolve(result);
        },
        (_, error) => {
          console.error("刪除 reminders 表時出錯：", error);
          reject(error);
        }
      );
    });
  });
};

export const deleteAllBudgeData = () => {
  return new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM budge",
          [],
          () => {
            console.log("成功刪除 budge 表格中的所有數據");
            resolve();
          },
          (error) => {
            console.error("刪除 budge 表格中的資料時發生錯誤", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.error("資料庫事務初始化失敗", error);
        reject(error);
      },
      (success) => {
        console.log("資料庫事務初始化成功");
      }
    );
  });
};
