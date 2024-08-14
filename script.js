const tbody = document.querySelector("tbody");
const form = document.querySelector("#tracker__form");

let balance = 12_300_420.01;
balance = new Intl.NumberFormat("en-US").format(balance);
let balanceText = document.querySelector("#balance");
balanceText.textContent = balance;

class Expenses {
  constructor(category, amount, date, id) {
    this._category = category;
    this._amount = amount;
    this._date = date;
    this._id = id;
  }
}

class UI {
  static showExpenses() {
    const expenses = Store.getExpenses();

    expenses.forEach((expense, index) => {
      UI.addExpenses(expense, index);
    });
  }

  static addExpenses(expense, index) {
    // Adding Expenses
    const tRow = document.createElement("tr");
    tRow.setAttribute("data-id", expense._id);
    tRow.innerHTML = `
      <td>0${index + 1}</td>
      <td>${expense._category}</td>
      <td>${expense._amount}</td>
      <td>${expense._date}</td>
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
  const id = Math.floor(Math.random() * 1000000000 + 1);

  // Everytime we submit, we add new expenses to the UI
  const expenses = new Expenses(categoryValue, amountValue, dateValue, id);
  UI.addExpenses(expenses);
  Store.addExpenses(expenses);

  // Clear input fields
  category.value = "";
  amount.value = "";
  date.value = "";

  // Update balance
});

tbody.addEventListener("click", (e) => {
  // Deleting expenses
  UI.deleteExpenses(e.target);
  Store.deleteExpenses(e.target);
});

document.addEventListener("DOMContentLoaded", UI.showExpenses);
