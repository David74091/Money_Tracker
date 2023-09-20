export class Expense {
  constructor(
    id,
    date,
    amount,
    description,
    type,
    category,
    account,
    icon_type,
    icon_name
  ) {
    this.id = id;
    this.date = date;
    this.amount = amount;
    this.description = description;
    this.type = type;
    this.category = category;
    this.account = account;
    this.icon = { type: icon_type, name: icon_name };
  }
}
export class Account {
  constructor(id, name, balance) {
    this.id = id;
    this.name = name;
    this.balance = balance;
  }
}
