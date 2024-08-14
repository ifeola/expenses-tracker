const tbody = document.querySelector("tbody");
const form = document.querySelector("#tracker__form");
let balanceText = document.querySelector("#balance");

let myBalance = 240860;
myBalance.toFixed(2);
balanceText.textContent = myBalance;

class Expenses {
  constructor(category, amount, date, id) {
    this._category = category;
    this._amount = amount;
    this._date = date;
    this._id = id;
  }
}

class Store {
  static getExpenses() {
    let expensesArray;

    if (localStorage.getItem("expensesArray") === null) {
      expensesArray = [];
    } else {
      expensesArray = JSON.parse(localStorage.getItem("expensesArray"));
    }
    return expensesArray;
  }

  static addExpenses(expense) {
    const expensesArray = Store.getExpenses();
    expensesArray.push(expense);
    localStorage.setItem("expensesArray", JSON.stringify(expensesArray));
  }

  static deleteExpenses(target) {
    let targetId = target.parentElement.parentElement.dataset.id;

    const expensesArray = Store.getExpenses();

    expensesArray.forEach((expense, index) => {
      if (
        targetId === String(expense._id) &&
        target.classList.contains("delete-exp")
      ) {
        expensesArray.splice(index, 1);
      }
    });
    localStorage.setItem("expensesArray", JSON.stringify(expensesArray));
  }

  // static setBalance(balance) {
  //   let localBalance;

  //   if (localStorage.getItem("localBalance") === null) {
  //     localBalance = "";
  //   } else {
  //     JSON.parse(localStorage.getItem("localBalance"));
  //   }

  //   return localBalance;
  // }
}

class UI {
  static showExpenses() {
    const expenses = Store.getExpenses();
    expenses.forEach((expense) => {
      UI.addExpenses(expense);
    });
  }

  static addExpenses(expense) {
    // Adding Expenses
    const tRow = document.createElement("tr");
    tRow.setAttribute("data-id", expense._id);
    tRow.innerHTML = `
        <td>${expense._id}</td>
        <td>${expense._category}</td>
        <td>${expense._amount}</td>
        <td>${expense._date} </td>
        <td><button class='delete-exp'>Delete</button></td>
      `;
    tbody.appendChild(tRow);
  }

  static deleteExpenses(target) {
    if (!target.classList.contains("delete-exp")) return;
    else {
      const row = target.parentElement.parentElement;
      const rowParent = target.parentElement.parentElement.parentElement;
      rowParent.removeChild(row);
    }
  }

  static updateBalance(amount) {
    let total = balanceText.textContent - amount;
    // total = new Intl.NumberFormat("en-US").format(total);
    balanceText.textContent = total;
    // Store.setBalance(balanceText.textContent);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Input values
  let category = form.querySelector("#category");
  let amount = form.querySelector("#amount");
  let date = form.querySelector("#date");

  let categoryValue = category.value;
  let amountValue = amount.value;
  let dateValue = date.value;

  // Generate random ID anytime we submit
  const id = Math.floor(Math.random() * 10000 + 1);

  // Everytime we submit, we add new expenses to the UI
  const expenses = new Expenses(categoryValue, amountValue, dateValue, id);

  UI.addExpenses(expenses);
  Store.addExpenses(expenses);

  // Clear input fields
  category.value = "";
  amount.value = "";
  date.value = "";

  // Update balance
  UI.updateBalance(amountValue);
});

tbody.addEventListener("click", (e) => {
  // Deleting expenses
  UI.deleteExpenses(e.target);
  Store.deleteExpenses(e.target);
});

document.addEventListener("DOMContentLoaded", UI.showExpenses);
